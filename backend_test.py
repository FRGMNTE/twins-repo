#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, List

class GltzAdminAPITester:
    def __init__(self, base_url="https://twin-family.preview.emergentagent.com/api"):
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
            elif method.upper() == 'PUT':
                response = requests.put(url, json=data, headers=request_headers, params=params, timeout=10)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=request_headers, params=params, timeout=10)
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
    
    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, response = self.make_request('GET', '/')
        if success and response.get('message') == 'gltz.de API':
            self.log_result("API Root Endpoint", True)
            return True
        else:
            self.log_result("API Root Endpoint", False, f"Expected 'gltz.de API', got: {response}")
            return False
    
    def test_seed_data(self):
        """Test seeding initial data"""
        success, response = self.make_request('POST', '/seed')
        if success and response.get('success'):
            self.log_result("Seed Data Creation", True)
            return True
        else:
            self.log_result("Seed Data Creation", False, f"Response: {response}")
            return False
    
    def test_blog_endpoints(self):
        """Test blog-related endpoints"""
        # Test GET blog posts
        success, response = self.make_request('GET', '/blog?limit=3')
        if success and isinstance(response, list):
            self.log_result("Get Blog Posts", True)
            blog_posts_count = len(response)
        else:
            self.log_result("Get Blog Posts", False, f"Expected list, got: {response}")
            return False
            
        # Test creating a blog post
        new_post = {
            "title": "Test Blog Post",
            "excerpt": "This is a test excerpt",
            "content": "This is test content for the blog post",
            "category": "Test",
            "image_url": "https://example.com/test.jpg"
        }
        
        success, response = self.make_request('POST', '/blog', new_post, 200)
        if success and response.get('id'):
            self.log_result("Create Blog Post", True)
            post_id = response['id']
            
            # Test deleting the blog post
            success, response = self.make_request('DELETE', f'/blog/{post_id}')
            if success and response.get('success'):
                self.log_result("Delete Blog Post", True)
            else:
                self.log_result("Delete Blog Post", False, f"Response: {response}")
        else:
            self.log_result("Create Blog Post", False, f"Response: {response}")
            
        return True
    
    def test_gallery_endpoints(self):
        """Test gallery-related endpoints"""
        # Test GET gallery images
        success, response = self.make_request('GET', '/gallery')
        if success and isinstance(response, list):
            self.log_result("Get Gallery Images", True)
            return True
        else:
            self.log_result("Get Gallery Images", False, f"Expected list, got: {response}")
            return False
    
    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "thema": "tipps",
            "nachricht": "This is a test message from the automated test suite."
        }
        
        success, response = self.make_request('POST', '/contact', contact_data)
        if success and response.get('id'):
            self.log_result("Contact Form Submission", True)
            
            # Test getting contact submissions
            success, response = self.make_request('GET', '/contact')
            if success and isinstance(response, list):
                self.log_result("Get Contact Submissions", True)
                return True
            else:
                self.log_result("Get Contact Submissions", False, f"Expected list, got: {response}")
                return False
        else:
            self.log_result("Contact Form Submission", False, f"Response: {response}")
            return False
    
    def test_admin_authentication(self):
        """Test admin authentication flow"""
        # Test requesting admin code with correct email
        success, response = self.make_request('POST', '/admin/request-code', 
                                            {"email": self.admin_email})
        if success and response.get('success'):
            self.log_result("Admin Code Request (Valid Email)", True)
            
            # Extract code from response message if available
            message = response.get('message', '')
            if 'Code:' in message:
                code = message.split('Code:')[1].strip().split()[0]
                
                # Test verifying the code
                success, response = self.make_request('POST', '/admin/verify-code',
                                                    {"email": self.admin_email, "code": code})
                if success and response.get('token'):
                    self.log_result("Admin Code Verification", True)
                    self.session_token = response['token']
                    
                    # Test session verification
                    success, response = self.make_request('GET', f'/admin/verify-session?token={self.session_token}')
                    if success and response.get('valid'):
                        self.log_result("Admin Session Verification", True)
                        return True
                    else:
                        self.log_result("Admin Session Verification", False, f"Response: {response}")
                else:
                    self.log_result("Admin Code Verification", False, f"Response: {response}")
            else:
                self.log_result("Admin Code Verification", False, "No code found in response")
        else:
            self.log_result("Admin Code Request (Valid Email)", False, f"Response: {response}")
        
        # Test requesting admin code with invalid email
        success, response = self.make_request('POST', '/admin/request-code', 
                                            {"email": "invalid@example.com"}, 403)
        if success:
            self.log_result("Admin Code Request (Invalid Email - Should Fail)", True)
        else:
            self.log_result("Admin Code Request (Invalid Email - Should Fail)", False, 
                          f"Expected 403, got different response: {response}")
        
        return True
    
    def test_contact_form_validation(self):
        """Test contact form validation"""
        # Test missing required fields
        invalid_data = {
            "name": "Test User",
            # Missing email, thema, nachricht
        }
        
        success, response = self.make_request('POST', '/contact', invalid_data, 422)
        if not success and response.get('status_code') == 422:
            self.log_result("Contact Form Validation (Missing Fields)", True)
        else:
            self.log_result("Contact Form Validation (Missing Fields)", False, 
                          f"Expected validation error, got: {response}")
        
        # Test invalid email format
        invalid_email_data = {
            "email": "invalid-email",
            "thema": "tipps",
            "nachricht": "Test message"
        }
        
        success, response = self.make_request('POST', '/contact', invalid_email_data, 422)
        if not success and response.get('status_code') == 422:
            self.log_result("Contact Form Validation (Invalid Email)", True)
        else:
            self.log_result("Contact Form Validation (Invalid Email)", False, 
                          f"Expected validation error, got: {response}")
        
        return True
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting gltz.de Backend API Tests")
        print("=" * 50)
        
        # Test basic connectivity
        if not self.test_root_endpoint():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Run all test suites
        self.test_seed_data()
        self.test_blog_endpoints()
        self.test_gallery_endpoints()
        self.test_contact_form()
        self.test_contact_form_validation()
        self.test_admin_authentication()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for failure in self.failed_tests:
                print(f"  - {failure['test']}: {failure['details']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"✅ Success Rate: {success_rate:.1f}%")
        
        return len(self.failed_tests) == 0

def main():
    """Main test execution"""
    tester = GltzAPITester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except Exception as e:
        print(f"💥 Test execution failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())