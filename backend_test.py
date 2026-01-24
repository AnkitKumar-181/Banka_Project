import requests
import sys
import json
from datetime import datetime

class BakaNewsAPITester:
    def __init__(self, base_url="https://newshub-117.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected: {expected_status})"
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test(name, success, details)
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_editor_signup(self):
        """Test editor signup"""
        test_email = f"test_editor_{datetime.now().strftime('%H%M%S')}@bakanews.com"
        success, response = self.run_test(
            "Editor Signup",
            "POST",
            "auth/signup",
            200,
            data={
                "email": test_email,
                "password": "testpass123",
                "name": "Test Editor"
            }
        )
        
        if success and 'token' in response:
            self.token = response['token']
            return True, test_email
        return False, None

    def test_editor_login(self):
        """Test editor login with existing account"""
        success, response = self.run_test(
            "Editor Login (Existing Account)",
            "POST",
            "auth/login",
            200,
            data={
                "email": "editor@bakanews.com",
                "password": "password123"
            }
        )
        
        if success and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        success, _ = self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,
            data={
                "email": "invalid@test.com",
                "password": "wrongpass"
            }
        )
        return success

    def test_get_articles(self):
        """Test getting all articles"""
        success, response = self.run_test(
            "Get All Articles",
            "GET",
            "articles",
            200
        )
        
        if success:
            articles_count = len(response) if isinstance(response, list) else 0
            self.log_test("Articles Count Check", articles_count >= 0, f"Found {articles_count} articles")
            return success, response
        return False, []

    def test_get_articles_by_category(self):
        """Test getting articles by category"""
        categories = ["Bihar", "Banka", "Local News", "Trending"]
        
        for category in categories:
            success, response = self.run_test(
                f"Get Articles - {category}",
                "GET",
                f"articles?category={category}",
                200
            )
            
            if success and isinstance(response, list):
                # Verify all articles have the correct category
                for article in response:
                    if article.get('category') != category:
                        self.log_test(f"Category Filter - {category}", False, f"Found article with wrong category: {article.get('category')}")
                        return False
                
                self.log_test(f"Category Filter - {category}", True, f"Found {len(response)} articles")

    def test_search_articles(self):
        """Test article search functionality"""
        success, response = self.run_test(
            "Search Articles",
            "GET",
            "articles/search?q=news",
            200
        )
        return success

    def test_create_article(self):
        """Test creating a new article"""
        if not self.token:
            self.log_test("Create Article", False, "No authentication token")
            return False, None

        article_data = {
            "title": f"Test Article {datetime.now().strftime('%H%M%S')}",
            "category": "Bihar",
            "body": "This is a test article created by the automated test suite. It contains sample content to verify the article creation functionality.",
            "image_url": "https://res.cloudinary.com/dztdhwjdh/image/upload/v1/baka_news/articles/sample_image.jpg",
            "image_public_id": "baka_news/articles/sample_image"
        }

        success, response = self.run_test(
            "Create Article",
            "POST",
            "articles",
            200,
            data=article_data
        )
        
        if success and 'id' in response:
            return True, response['id']
        return False, None

    def test_get_single_article(self, article_id):
        """Test getting a single article by ID"""
        if not article_id:
            self.log_test("Get Single Article", False, "No article ID provided")
            return False

        success, response = self.run_test(
            "Get Single Article",
            "GET",
            f"articles/{article_id}",
            200
        )
        
        if success:
            required_fields = ['id', 'title', 'category', 'body', 'image_url', 'created_at']
            for field in required_fields:
                if field not in response:
                    self.log_test("Article Fields Check", False, f"Missing field: {field}")
                    return False
            
            self.log_test("Article Fields Check", True, "All required fields present")
        
        return success

    def test_update_article(self, article_id):
        """Test updating an article"""
        if not article_id or not self.token:
            self.log_test("Update Article", False, "Missing article ID or token")
            return False

        update_data = {
            "title": f"Updated Test Article {datetime.now().strftime('%H%M%S')}",
            "body": "This article has been updated by the automated test suite."
        }

        success, response = self.run_test(
            "Update Article",
            "PUT",
            f"articles/{article_id}",
            200,
            data=update_data
        )
        return success

    def test_delete_article(self, article_id):
        """Test deleting an article"""
        if not article_id or not self.token:
            self.log_test("Delete Article", False, "Missing article ID or token")
            return False

        success, response = self.run_test(
            "Delete Article",
            "DELETE",
            f"articles/{article_id}",
            200
        )
        return success

    def test_protected_routes_without_auth(self):
        """Test that protected routes require authentication"""
        # Temporarily remove token
        original_token = self.token
        self.token = None

        # Test creating article without auth
        success, _ = self.run_test(
            "Create Article (No Auth)",
            "POST",
            "articles",
            401,
            data={
                "title": "Test",
                "category": "Bihar",
                "body": "Test",
                "image_url": "test.jpg",
                "image_public_id": "test"
            }
        )

        # Test cloudinary signature without auth
        success2, _ = self.run_test(
            "Cloudinary Signature (No Auth)",
            "GET",
            "cloudinary/signature",
            401
        )

        # Restore token
        self.token = original_token
        return success and success2

    def test_cloudinary_signature(self):
        """Test cloudinary signature generation"""
        if not self.token:
            self.log_test("Cloudinary Signature", False, "No authentication token")
            return False

        success, response = self.run_test(
            "Cloudinary Signature",
            "GET",
            "cloudinary/signature",
            200
        )
        
        if success:
            required_fields = ['signature', 'timestamp', 'cloud_name', 'api_key']
            for field in required_fields:
                if field not in response:
                    self.log_test("Cloudinary Response Check", False, f"Missing field: {field}")
                    return False
            
            self.log_test("Cloudinary Response Check", True, "All required fields present")
        
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Baka News API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)

        # Test authentication
        print("\n📝 Testing Authentication...")
        self.test_invalid_login()
        
        # Try login with existing account first
        login_success = self.test_editor_login()
        
        if not login_success:
            # If existing login fails, try signup
            signup_success, test_email = self.test_editor_signup()
            if not signup_success:
                print("❌ Cannot proceed without authentication")
                return False

        # Test protected routes without auth
        print("\n🔒 Testing Protected Routes...")
        self.test_protected_routes_without_auth()

        # Test cloudinary integration
        print("\n☁️ Testing Cloudinary Integration...")
        self.test_cloudinary_signature()

        # Test article operations
        print("\n📰 Testing Article Operations...")
        articles_success, articles = self.test_get_articles()
        self.test_get_articles_by_category()
        self.test_search_articles()

        # Test CRUD operations
        print("\n🔄 Testing CRUD Operations...")
        create_success, article_id = self.test_create_article()
        
        if create_success and article_id:
            self.test_get_single_article(article_id)
            self.test_update_article(article_id)
            self.test_delete_article(article_id)

        # Test with existing article if available
        if articles and len(articles) > 0:
            existing_article_id = articles[0].get('id')
            if existing_article_id:
                self.test_get_single_article(existing_article_id)

        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️ {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = BakaNewsAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_results_backend.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
                'timestamp': datetime.now().isoformat()
            },
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())