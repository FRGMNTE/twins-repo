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
    
    def test_admin_login(self):
        """Test admin password-based login"""
        login_data = {"password": self.admin_password}
        
        success, response = self.make_request('POST', '/admin/login', login_data)
        if success and response.get('token'):
            self.log_result("Admin Login", True)
            self.admin_token = response['token']
            
            # Test token verification
            success, response = self.make_request('GET', '/admin/verify')
            if success and response.get('valid'):
                self.log_result("Admin Token Verification", True)
                return True
            else:
                self.log_result("Admin Token Verification", False, f"Response: {response}")
                return False
        else:
            self.log_result("Admin Login", False, f"Response: {response}")
            return False
    
    def test_admin_stats(self):
        """Test admin dashboard stats"""
        if not self.admin_token:
            self.log_result("Admin Stats", False, "No admin token available")
            return False
            
        success, response = self.make_request('GET', '/admin/stats')
        if success and 'total_contacts' in response:
            self.log_result("Admin Dashboard Stats", True)
            return True
        else:
            self.log_result("Admin Dashboard Stats", False, f"Response: {response}")
            return False
    
    def test_admin_pages_crud(self):
        """Test admin pages CRUD operations"""
        if not self.admin_token:
            self.log_result("Admin Pages CRUD", False, "No admin token available")
            return False
        
        # Test GET pages
        success, response = self.make_request('GET', '/admin/pages')
        if success and isinstance(response, list):
            self.log_result("Get Admin Pages", True)
        else:
            self.log_result("Get Admin Pages", False, f"Response: {response}")
            return False
        
        # Test CREATE page
        new_page = {
            "title": "Test Page",
            "slug": "test-page",
            "content": "This is test content",
            "status": "draft"
        }
        
        success, response = self.make_request('POST', '/admin/pages', new_page, 200)
        if success and response.get('id'):
            self.log_result("Create Admin Page", True)
            page_id = response['id']
            
            # Test UPDATE page
            updated_page = {
                "title": "Updated Test Page",
                "slug": "test-page",
                "content": "Updated content",
                "status": "live"
            }
            
            success, response = self.make_request('PUT', f'/admin/pages/{page_id}', updated_page)
            if success:
                self.log_result("Update Admin Page", True)
            else:
                self.log_result("Update Admin Page", False, f"Response: {response}")
            
            # Test DUPLICATE page
            success, response = self.make_request('POST', f'/admin/pages/{page_id}/duplicate')
            if success and response.get('id'):
                self.log_result("Duplicate Admin Page", True)
                duplicate_id = response['id']
                
                # Clean up duplicate
                self.make_request('DELETE', f'/admin/pages/{duplicate_id}')
            else:
                self.log_result("Duplicate Admin Page", False, f"Response: {response}")
            
            # Test DELETE page
            success, response = self.make_request('DELETE', f'/admin/pages/{page_id}')
            if success and response.get('success'):
                self.log_result("Delete Admin Page", True)
            else:
                self.log_result("Delete Admin Page", False, f"Response: {response}")
                
            return True
        else:
            self.log_result("Create Admin Page", False, f"Response: {response}")
            return False
    
    def test_admin_gallery_crud(self):
        """Test admin gallery CRUD operations"""
        if not self.admin_token:
            self.log_result("Admin Gallery CRUD", False, "No admin token available")
            return False
        
        # Test GET gallery
        success, response = self.make_request('GET', '/admin/gallery')
        if success and isinstance(response, list):
            self.log_result("Get Admin Gallery", True)
        else:
            self.log_result("Get Admin Gallery", False, f"Response: {response}")
            return False
        
        # Test ADD image
        params = {
            'token': self.admin_token,
            'url': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
            'title': 'Test Image',
            'tags': 'Test,Automated'
        }
        
        success, response = self.make_request('POST', '/admin/gallery', params=params)
        if success and response.get('id'):
            self.log_result("Add Gallery Image", True)
            image_id = response['id']
            
            # Test UPDATE image
            update_params = {
                'token': self.admin_token,
                'title': 'Updated Test Image',
                'alt': 'Updated alt text',
                'tags': 'Updated,Test'
            }
            
            success, response = self.make_request('PUT', f'/admin/gallery/{image_id}', params=update_params)
            if success and response.get('success'):
                self.log_result("Update Gallery Image", True)
            else:
                self.log_result("Update Gallery Image", False, f"Response: {response}")
            
            # Test DELETE image
            success, response = self.make_request('DELETE', f'/admin/gallery/{image_id}')
            if success and response.get('success'):
                self.log_result("Delete Gallery Image", True)
            else:
                self.log_result("Delete Gallery Image", False, f"Response: {response}")
                
            return True
        else:
            self.log_result("Add Gallery Image", False, f"Response: {response}")
            return False
    
    def test_admin_contacts(self):
        """Test admin contacts functionality"""
        if not self.admin_token:
            self.log_result("Admin Contacts", False, "No admin token available")
            return False
        
        # Test GET contacts
        success, response = self.make_request('GET', '/admin/contacts')
        if success and isinstance(response, list):
            self.log_result("Get Admin Contacts", True)
            
            # Test CSV export
            success, response = self.make_request('GET', '/admin/contacts/export')
            if success and 'csv' in response:
                self.log_result("Export Contacts CSV", True)
            else:
                self.log_result("Export Contacts CSV", False, f"Response: {response}")
                
            return True
        else:
            self.log_result("Get Admin Contacts", False, f"Response: {response}")
            return False
    
    def test_admin_posts_crud(self):
        """Test admin blog posts CRUD operations"""
        if not self.admin_token:
            self.log_result("Admin Posts CRUD", False, "No admin token available")
            return False
        
        # Test GET posts
        success, response = self.make_request('GET', '/admin/posts')
        if success and isinstance(response, list):
            self.log_result("Get Admin Posts", True)
        else:
            self.log_result("Get Admin Posts", False, f"Response: {response}")
            return False
        
        # Test CREATE post
        new_post = {
            "title": "Test Blog Post",
            "excerpt": "Test excerpt",
            "content": "Test content",
            "category": "Tipps",
            "status": "draft"
        }
        
        success, response = self.make_request('POST', '/admin/posts', new_post)
        if success and response.get('id'):
            self.log_result("Create Admin Post", True)
            post_id = response['id']
            
            # Test UPDATE post
            updated_post = {
                "title": "Updated Test Post",
                "excerpt": "Updated excerpt",
                "content": "Updated content",
                "category": "Tipps",
                "status": "live"
            }
            
            success, response = self.make_request('PUT', f'/admin/posts/{post_id}', updated_post)
            if success:
                self.log_result("Update Admin Post", True)
            else:
                self.log_result("Update Admin Post", False, f"Response: {response}")
            
            # Test DELETE post
            success, response = self.make_request('DELETE', f'/admin/posts/{post_id}')
            if success and response.get('success'):
                self.log_result("Delete Admin Post", True)
            else:
                self.log_result("Delete Admin Post", False, f"Response: {response}")
                
            return True
        else:
            self.log_result("Create Admin Post", False, f"Response: {response}")
            return False
    
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