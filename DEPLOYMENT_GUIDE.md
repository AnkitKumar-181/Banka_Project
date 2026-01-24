# Banka News - Local Deployment Guide

## Prerequisites
- Node.js 16+ installed
- Python 3.8+ installed
- Git installed
- GitHub account
- MongoDB Atlas account (free tier)

## Quick Start

### 1. Setup Locally

```bash
# Clone your repository
git clone [your-repo-url]
cd banka-news

# Backend Setup
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python -m uvicorn server:app --reload

# Frontend Setup (new terminal)
cd frontend
yarn install
yarn start
```

### 2. Deploy to Vercel + Railway

**Frontend (Vercel):**
```bash
cd frontend
npm install -g vercel
vercel login
vercel
# Follow prompts
# Set environment variable: REACT_APP_BACKEND_URL
```

**Backend (Railway):**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Add service → MongoDB
5. Add environment variables:
   - JWT_SECRET
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - CORS_ORIGINS (add your Vercel URL)

### 3. Deploy to Render (Full Stack)

1. Go to https://render.com
2. New → Web Service (for backend)
   - Build: `pip install -r backend/requirements.txt`
   - Start: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
3. New → Static Site (for frontend)
   - Build: `cd frontend && yarn install && yarn build`
   - Publish: `frontend/build`
4. Connect MongoDB Atlas or use Render's database

### 4. MongoDB Setup (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Database Access → Add User
4. Network Access → Add IP (0.0.0.0/0 for development)
5. Get connection string
6. Update MONGO_URL in your deployment platform

### 5. Environment Variables

**Backend (.env):**
```
MONGO_URL=your_mongodb_connection_string
DB_NAME=banka_news
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=dztdhwjdh
CLOUDINARY_API_KEY=947115866845927
CLOUDINARY_API_SECRET=0gXQVbUOT7F9tl2z8KNuxyjYOOA
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

**Frontend (.env):**
```
REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

## Platform Comparison

| Platform | Cost | Ease | Best For |
|----------|------|------|----------|
| Vercel + Railway | Free tier | ⭐⭐⭐⭐⭐ | Quick deployment |
| Render | Free tier | ⭐⭐⭐⭐ | Full stack in one place |
| Heroku | $7/month | ⭐⭐⭐ | Traditional deployment |
| AWS/GCP | Pay per use | ⭐⭐ | Enterprise scale |

## Troubleshooting

### Build Fails
- Check Node/Python versions
- Verify all dependencies in package.json/requirements.txt

### CORS Errors
- Add frontend URL to CORS_ORIGINS in backend .env
- Update backend URL in frontend .env

### Database Connection
- Whitelist IP addresses in MongoDB Atlas
- Check MONGO_URL format
- Verify DB_NAME matches

### Images Not Loading
- Verify Cloudinary credentials
- Check image URLs are accessible

## Custom Domain

**Vercel:**
1. Domain Settings → Add Domain
2. Update DNS records with your provider

**Railway:**
1. Settings → Domains → Add Custom Domain
2. Add CNAME record to your DNS

## Support

For issues:
1. Check platform-specific logs
2. Verify environment variables
3. Test API endpoints with Postman
4. Check browser console for frontend errors
