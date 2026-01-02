#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, List

class RefactoringAPITester:
    def __init__(self, base_url="https://gltz-family-portal.preview.emergentagent.com"):
        self.base_url = base_url
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.admin_password = "gltz2025"
        
    def log_result(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name} - FAILED: {details}")
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, 
                    expected_status: int = 200, headers: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return success status and response"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        request_headers = {'Content-Type': 'application/json'}
        if headers:
            request_headers.update(headers)
            
        # Add token as query parameter for admin endpoints
        if self.admin_token and '/admin/' in endpoint:
            if not params:
                params = {}
            params['token'] = self.admin_token
            
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=request_headers, params=params, timeout=10)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=request_headers, params=params, timeout=10)
            else:
                return False, {"error": f"Unsupported method: {method}"}
                
            success = response.status_code == expected_status
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text, "status_code": response.status_code}
                
            return success, response_data
            
        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}
    
    def test_health_check(self):
        """Test Health Check: GET /health"""
        # Try both /health and /api/health endpoints
        success, response = self.make_request('GET', '/health')
        if success and response.get('status') == 'healthy':
            self.log_result("Health Check", True)
            return True
        else:
            # Try /api/health as fallback
            success, response = self.make_request('GET', '/api/health')
            if success and response.get('status') == 'healthy':
                self.log_result("Health Check", True, "Available at /api/health")
                return True
            else:
                self.log_result("Health Check", False, f"Expected status: healthy, got: {response}")
                return False
    
    def test_settings_api(self):
        """Test Settings API: GET /api/settings"""
        success, response = self.make_request('GET', '/api/settings')
        if success and 'siteTitle' in response:
            self.log_result("Settings API", True)
            return True
        else:
            self.log_result("Settings API", False, f"Expected siteTitle in response, got: {response}")
            return False
    
    def test_blog_api(self):
        """Test Blog API: GET /api/blog and GET /api/blog/{post_id}"""
        # Test GET /api/blog
        success, response = self.make_request('GET', '/api/blog')
        if success and isinstance(response, list):
            self.log_result("Blog API - List Posts", True)
            
            # If we have posts, test individual post endpoint
            if response:
                post_id = response[0].get('id')
                if post_id:
                    success, post_response = self.make_request('GET', f'/api/blog/{post_id}')
                    if success and post_response.get('id') == post_id:
                        self.log_result("Blog API - Single Post", True)
                        return True
                    else:
                        self.log_result("Blog API - Single Post", False, f"Response: {post_response}")
                        return False
                else:
                    self.log_result("Blog API - Single Post", False, "No post ID found in blog list")
                    return False
            else:
                self.log_result("Blog API - Single Post", True, "No posts to test individual endpoint")
                return True
        else:
            self.log_result("Blog API - List Posts", False, f"Expected list, got: {response}")
            return False
    
    def test_pages_api(self):
        """Test Pages API: GET /api/pages"""
        success, response = self.make_request('GET', '/api/pages')
        if success and isinstance(response, list):
            self.log_result("Pages API", True)
            return True
        else:
            self.log_result("Pages API", False, f"Expected list, got: {response}")
            return False
    
    def test_gallery_api(self):
        """Test Gallery API: GET /api/gallery"""
        success, response = self.make_request('GET', '/api/gallery')
        if success and isinstance(response, list):
            self.log_result("Gallery API", True)
            return True
        else:
            self.log_result("Gallery API", False, f"Expected list, got: {response}")
            return False
    
    def test_news_api(self):
        """Test News API: GET /api/news"""
        success, response = self.make_request('GET', '/api/news')
        if success and isinstance(response, list):
            self.log_result("News API", True)
            return True
        else:
            self.log_result("News API", False, f"Expected list, got: {response}")
            return False
    
    def test_search_api(self):
        """Test Search API: GET /api/search?q=zwilling"""
        success, response = self.make_request('GET', '/api/search', params={'q': 'zwilling'})
        if success and isinstance(response, dict):
            # Check if response has expected search result structure
            expected_keys = ['pages', 'posts', 'gallery', 'static_pages']
            has_expected_structure = any(key in response for key in expected_keys)
            if has_expected_structure:
                self.log_result("Search API", True)
                return True
            else:
                self.log_result("Search API", False, f"Missing expected keys in response: {response}")
                return False
        else:
            self.log_result("Search API", False, f"Expected dict with search results, got: {response}")
            return False
    
    def test_static_pages_api(self):
        """Test Static Pages API: GET /api/static-pages/schwangerschaft"""
        success, response = self.make_request('GET', '/api/static-pages/schwangerschaft')
        if success and isinstance(response, dict):
            self.log_result("Static Pages API", True)
            return True
        else:
            self.log_result("Static Pages API", False, f"Expected dict, got: {response}")
            return False
    
    def test_landing_content_api(self):
        """Test Landing Content API: GET /api/landing-content"""
        success, response = self.make_request('GET', '/api/landing-content')
        if success and isinstance(response, dict):
            self.log_result("Landing Content API", True)
            return True
        else:
            self.log_result("Landing Content API", False, f"Expected dict, got: {response}")
            return False
    
    def test_admin_login(self):
        """Test Admin Login: POST /api/admin/login"""
        login_data = {"password": self.admin_password}
        
        success, response = self.make_request('POST', '/api/admin/login', login_data)
        if success and response.get('token'):
            self.log_result("Admin Login", True)
            self.admin_token = response['token']
            return True
        else:
            self.log_result("Admin Login", False, f"Response: {response}")
            return False
    
    def test_admin_stats(self):
        """Test Admin Stats: GET /api/admin/stats?token={token}"""
        if not self.admin_token:
            self.log_result("Admin Stats", False, "No admin token available")
            return False
            
        success, response = self.make_request('GET', '/api/admin/stats')
        if success and 'total_contacts' in response:
            self.log_result("Admin Stats", True)
            return True
        else:
            self.log_result("Admin Stats", False, f"Response: {response}")
            return False
    
    def run_refactoring_tests(self):
        """Run all refactoring validation tests"""
        print("🔄 Starting Refactored API Validation Tests")
        print("=" * 50)
        
        # Test all endpoints mentioned in the review request
        test_results = []
        
        # 1. Health Check
        test_results.append(self.test_health_check())
        
        # 2. Settings API
        test_results.append(self.test_settings_api())
        
        # 3. Blog API
        test_results.append(self.test_blog_api())
        
        # 4. Pages API
        test_results.append(self.test_pages_api())
        
        # 5. Gallery API
        test_results.append(self.test_gallery_api())
        
        # 6. News API
        test_results.append(self.test_news_api())
        
        # 7. Search API
        test_results.append(self.test_search_api())
        
        # 8. Static Pages API
        test_results.append(self.test_static_pages_api())
        
        # 9. Landing Content API
        test_results.append(self.test_landing_content_api())
        
        # 10. Admin Login
        if self.test_admin_login():
            # 11. Admin Stats (requires login)
            test_results.append(self.test_admin_stats())
        else:
            test_results.append(False)
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Refactoring Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for failure in self.failed_tests:
                print(f"  - {failure['test']}: {failure['details']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"✅ Success Rate: {success_rate:.1f}%")
        
        return len(self.failed_tests) == 0

def main():
    """Main test execution"""
    tester = RefactoringAPITester()
    
    try:
        success = tester.run_refactoring_tests()
        return 0 if success else 1
    except Exception as e:
        print(f"💥 Test execution failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())