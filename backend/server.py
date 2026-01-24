from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import cloudinary
import cloudinary.utils
from jose import JWTError, jwt
from passlib.context import CryptContext
import time

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

app = FastAPI()
api_router = APIRouter(prefix="/api")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 720

class EditorSignup(BaseModel):
    email: EmailStr
    password: str
    name: str

class EditorLogin(BaseModel):
    email: EmailStr
    password: str

class Editor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ArticleCreate(BaseModel):
    title: str
    category: str
    body: str
    image_url: str
    image_public_id: str

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    body: Optional[str] = None
    image_url: Optional[str] = None
    image_public_id: Optional[str] = None

class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    body: str
    image_url: str
    image_public_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_jwt_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_editor(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        editor_id = payload.get("sub")
        if editor_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        editor = await db.editors.find_one({"id": editor_id}, {"_id": 0})
        if editor is None:
            raise HTTPException(status_code=401, detail="Editor not found")
        return Editor(**editor)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/signup")
async def signup(editor_data: EditorSignup):
    existing = await db.editors.find_one({"email": editor_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    editor = Editor(
        email=editor_data.email,
        name=editor_data.name
    )
    doc = editor.model_dump()
    doc["password_hash"] = hash_password(editor_data.password)
    doc["created_at"] = doc["created_at"].isoformat()
    
    await db.editors.insert_one(doc)
    
    token = create_jwt_token({"sub": editor.id})
    return {"token": token, "editor": editor}

@api_router.post("/auth/login")
async def login(credentials: EditorLogin):
    editor_doc = await db.editors.find_one({"email": credentials.email}, {"_id": 0})
    if not editor_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, editor_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    editor = Editor(**editor_doc)
    token = create_jwt_token({"sub": editor.id})
    return {"token": token, "editor": editor}

@api_router.get("/cloudinary/signature")
async def generate_cloudinary_signature(
    resource_type: str = Query("image", enum=["image", "video"]),
    folder: str = "baka_news/articles",
    _: Editor = Depends(get_current_editor)
):
    ALLOWED_FOLDERS = ("baka_news/articles",)
    if folder not in ALLOWED_FOLDERS:
        raise HTTPException(status_code=400, detail="Invalid folder path")
    
    timestamp = int(time.time())
    params = {
        "timestamp": timestamp,
        "folder": folder,
        "resource_type": resource_type
    }
    
    signature = cloudinary.utils.api_sign_request(
        params,
        os.getenv("CLOUDINARY_API_SECRET")
    )
    
    return {
        "signature": signature,
        "timestamp": timestamp,
        "cloud_name": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "api_key": os.getenv("CLOUDINARY_API_KEY"),
        "folder": folder,
        "resource_type": resource_type
    }

@api_router.post("/articles", response_model=Article)
async def create_article(article_data: ArticleCreate, editor: Editor = Depends(get_current_editor)):
    article = Article(**article_data.model_dump())
    doc = article.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["updated_at"] = doc["updated_at"].isoformat()
    doc["editor_id"] = editor.id
    
    await db.articles.insert_one(doc)
    return article

@api_router.get("/articles", response_model=List[Article])
async def get_articles(category: Optional[str] = None, limit: int = 100):
    query = {}
    if category:
        query["category"] = category
    
    articles = await db.articles.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    
    for article in articles:
        if isinstance(article["created_at"], str):
            article["created_at"] = datetime.fromisoformat(article["created_at"])
        if isinstance(article["updated_at"], str):
            article["updated_at"] = datetime.fromisoformat(article["updated_at"])
    
    return articles

@api_router.get("/articles/search")
async def search_articles(q: str, limit: int = 50):
    articles = await db.articles.find(
        {"$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"body": {"$regex": q, "$options": "i"}}
        ]},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    
    for article in articles:
        if isinstance(article["created_at"], str):
            article["created_at"] = datetime.fromisoformat(article["created_at"])
        if isinstance(article["updated_at"], str):
            article["updated_at"] = datetime.fromisoformat(article["updated_at"])
    
    return articles

@api_router.get("/articles/{article_id}", response_model=Article)
async def get_article(article_id: str):
    article = await db.articles.find_one({"id": article_id}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if isinstance(article["created_at"], str):
        article["created_at"] = datetime.fromisoformat(article["created_at"])
    if isinstance(article["updated_at"], str):
        article["updated_at"] = datetime.fromisoformat(article["updated_at"])
    
    return Article(**article)

@api_router.put("/articles/{article_id}", response_model=Article)
async def update_article(article_id: str, article_data: ArticleUpdate, editor: Editor = Depends(get_current_editor)):
    existing = await db.articles.find_one({"id": article_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_data = {k: v for k, v in article_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    if existing.get("image_public_id") and article_data.image_public_id and existing["image_public_id"] != article_data.image_public_id:
        try:
            cloudinary.uploader.destroy(existing["image_public_id"], invalidate=True)
        except:
            pass
    
    await db.articles.update_one({"id": article_id}, {"$set": update_data})
    
    updated_article = await db.articles.find_one({"id": article_id}, {"_id": 0})
    if isinstance(updated_article["created_at"], str):
        updated_article["created_at"] = datetime.fromisoformat(updated_article["created_at"])
    if isinstance(updated_article["updated_at"], str):
        updated_article["updated_at"] = datetime.fromisoformat(updated_article["updated_at"])
    
    return Article(**updated_article)

@api_router.delete("/articles/{article_id}")
async def delete_article(article_id: str, editor: Editor = Depends(get_current_editor)):
    article = await db.articles.find_one({"id": article_id}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if article.get("image_public_id"):
        try:
            cloudinary.uploader.destroy(article["image_public_id"], invalidate=True)
        except:
            pass
    
    await db.articles.delete_one({"id": article_id})
    return {"message": "Article deleted successfully"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()