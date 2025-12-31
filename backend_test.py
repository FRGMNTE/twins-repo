#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, List

class GltzAdminAPITester:
    def __init__(self, base_url="https://zwillingsfamily.preview.emergentagent.com/api"):
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
        print("🚀 Starting gltz.de Dynamic Pages System Tests")
        print("=" * 50)
        
        # Test basic connectivity
        if not self.test_root_endpoint():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Seed data first
        self.test_seed_data()
        
        # Test admin authentication
        if not self.test_admin_login():
            print("❌ Admin authentication failed. Stopping admin tests.")
            return False
        
        # Test dynamic pages system specifically
        self.test_dynamic_pages_system()
        
        # Test other functionality
        self.test_public_endpoints()
        self.test_admin_stats()
        self.test_admin_pages_crud()
        self.test_admin_gallery_crud()
        self.test_admin_contacts()
        self.test_admin_posts_crud()
        self.test_settings_management()
        self.test_navigation_management()  # Add navigation-specific tests
        self.test_posts_with_publish_date_and_trash()  # Test posts with publish_date and trash
        self.test_pages_soft_delete_and_restore()  # Test pages soft delete and restore
        
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
    
    def test_public_endpoints(self):
        """Test public endpoints"""
        # Test public blog
        success, response = self.make_request('GET', '/blog?limit=3')
        if success and isinstance(response, list):
            self.log_result("Public Blog Posts", True)
        else:
            self.log_result("Public Blog Posts", False, f"Response: {response}")
        
        # Test public gallery
        success, response = self.make_request('GET', '/gallery')
        if success and isinstance(response, list):
            self.log_result("Public Gallery", True)
        else:
            self.log_result("Public Gallery", False, f"Response: {response}")
        
        # Test public contact form
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "thema": "Tipps",
            "nachricht": "This is a test message from the automated test suite."
        }
        
        success, response = self.make_request('POST', '/contact', contact_data)
        if success and response.get('id'):
            self.log_result("Public Contact Form", True)
        else:
            self.log_result("Public Contact Form", False, f"Response: {response}")
        
        # Test site settings
        success, response = self.make_request('GET', '/settings')
        if success and 'siteTitle' in response:
            self.log_result("Public Site Settings", True)
        else:
            self.log_result("Public Site Settings", False, f"Response: {response}")
        
        return True
    
    def test_settings_management(self):
        """Test settings management"""
        if not self.admin_token:
            self.log_result("Settings Management", False, "No admin token available")
            return False
        
        # Test saving settings
        test_settings = {
            "siteTitle": "Test Site Title",
            "heroTitle": "Test Hero",
            "logoText": "Test Logo"
        }
        
        success, response = self.make_request('POST', '/settings', test_settings)
        if success:
            self.log_result("Save Site Settings", True)
            return True
        else:
            self.log_result("Save Site Settings", False, f"Response: {response}")
            return False
    
    def test_navigation_management(self):
        """Test Navigation Management feature specifically"""
        print("\n🧭 Testing Navigation Management Feature")
        print("-" * 40)
        
        # Test GET /api/settings - should return navItems array with children and socialLinks array
        success, response = self.make_request('GET', '/settings')
        if not success:
            self.log_result("Navigation - GET Settings", False, f"Failed to get settings: {response}")
            return False
        
        # Verify navItems exists and has children array
        nav_items = response.get('navItems', [])
        if not nav_items:
            self.log_result("Navigation - NavItems Array", False, "navItems array not found")
            return False
        else:
            self.log_result("Navigation - NavItems Array", True)
        
        # Check if navItems have children array structure
        has_children_structure = True
        for item in nav_items:
            if 'children' not in item:
                has_children_structure = False
                break
        
        if has_children_structure:
            self.log_result("Navigation - NavItems Children Structure", True)
        else:
            self.log_result("Navigation - NavItems Children Structure", False, "Some navItems missing children array")
        
        # Verify M&O Portfolio has Twins-Art as child
        mo_portfolio = next((item for item in nav_items if item.get('label') == 'M&O Portfolio'), None)
        if mo_portfolio and mo_portfolio.get('children'):
            twins_art = next((child for child in mo_portfolio['children'] if child.get('label') == 'Twins-Art'), None)
            if twins_art:
                self.log_result("Navigation - M&O Portfolio Dropdown", True)
            else:
                self.log_result("Navigation - M&O Portfolio Dropdown", False, "Twins-Art not found in M&O Portfolio children")
        else:
            self.log_result("Navigation - M&O Portfolio Dropdown", False, "M&O Portfolio not found or has no children")
        
        # Verify socialLinks array exists
        social_links = response.get('socialLinks', None)
        if social_links is None:
            self.log_result("Navigation - SocialLinks Array", False, "socialLinks array not found")
            return False
        else:
            self.log_result("Navigation - SocialLinks Array", True)
        
        # Verify footerEmail exists (only email in contact)
        footer_email = response.get('footerEmail', None)
        if footer_email:
            self.log_result("Navigation - Footer Email Only", True)
        else:
            self.log_result("Navigation - Footer Email Only", False, "footerEmail not found")
        
        return True
    
    def test_posts_with_publish_date_and_trash(self):
        """Test blog posts with publish_date field and soft delete functionality"""
        print("\n📝 Testing Blog Posts with Publish Date and Trash")
        print("-" * 50)
        
        if not self.admin_token:
            self.log_result("Posts Trash Test", False, "No admin token available")
            return False
        
        # Test CREATE post with publish_date
        test_date = "2024-01-15T10:30:00Z"
        new_post = {
            "title": "Test Post with Date",
            "excerpt": "Test excerpt for date testing",
            "content": "Test content with publish date",
            "category": "Tipps",
            "status": "draft",
            "publish_date": test_date
        }
        
        success, response = self.make_request('POST', '/admin/posts', new_post)
        if success and response.get('id'):
            self.log_result("Posts - Create with Publish Date", True)
            post_id = response['id']
            
            # Verify publish_date field exists in response
            if 'publish_date' in response:
                self.log_result("Posts - Publish Date Field", True)
            else:
                self.log_result("Posts - Publish Date Field", False, "publish_date field missing in response")
            
            # Test soft delete (move to trash)
            success, response = self.make_request('DELETE', f'/admin/posts/{post_id}')
            if success and response.get('success'):
                self.log_result("Posts - Soft Delete", True)
                
                # Verify post is in trash
                success, trash_response = self.make_request('GET', '/admin/posts/trash')
                if success and isinstance(trash_response, list):
                    trashed_post = next((p for p in trash_response if p.get('id') == post_id), None)
                    if trashed_post:
                        self.log_result("Posts - Verify in Trash", True)
                        
                        # Test restore from trash
                        success, restore_response = self.make_request('POST', f'/admin/posts/{post_id}/restore')
                        if success and restore_response.get('success'):
                            self.log_result("Posts - Restore from Trash", True)
                            
                            # Test permanent delete
                            success, perm_delete_response = self.make_request('DELETE', f'/admin/posts/{post_id}', params={'permanent': True})
                            if success and perm_delete_response.get('success'):
                                self.log_result("Posts - Permanent Delete", True)
                            else:
                                self.log_result("Posts - Permanent Delete", False, f"Response: {perm_delete_response}")
                        else:
                            self.log_result("Posts - Restore from Trash", False, f"Response: {restore_response}")
                    else:
                        self.log_result("Posts - Verify in Trash", False, "Post not found in trash")
                else:
                    self.log_result("Posts - Verify in Trash", False, f"Failed to get trash: {trash_response}")
            else:
                self.log_result("Posts - Soft Delete", False, f"Response: {response}")
                
            return True
        else:
            self.log_result("Posts - Create with Publish Date", False, f"Response: {response}")
            return False
    
    def test_pages_soft_delete_and_restore(self):
        """Test pages soft delete and restore functionality"""
        print("\n📄 Testing Pages Soft Delete and Restore")
        print("-" * 45)
        
        if not self.admin_token:
            self.log_result("Pages Trash Test", False, "No admin token available")
            return False
        
        # Test CREATE page
        new_page = {
            "title": "Test Page for Trash",
            "slug": "test-page-trash",
            "content": "This page will be tested for trash functionality",
            "status": "draft"
        }
        
        success, response = self.make_request('POST', '/admin/pages', new_page)
        if success and response.get('id'):
            self.log_result("Pages - Create for Trash Test", True)
            page_id = response['id']
            
            # Test soft delete (move to trash)
            success, response = self.make_request('DELETE', f'/admin/pages/{page_id}')
            if success and response.get('success'):
                self.log_result("Pages - Soft Delete", True)
                
                # Verify page is in trash
                success, trash_response = self.make_request('GET', '/admin/pages/trash')
                if success and isinstance(trash_response, list):
                    trashed_page = next((p for p in trash_response if p.get('id') == page_id), None)
                    if trashed_page and trashed_page.get('deleted_at'):
                        self.log_result("Pages - Verify in Trash with deleted_at", True)
                        
                        # Test restore from trash
                        success, restore_response = self.make_request('POST', f'/admin/pages/{page_id}/restore')
                        if success and restore_response.get('success'):
                            self.log_result("Pages - Restore from Trash", True)
                            
                            # Verify page is restored (not in trash anymore)
                            success, active_pages = self.make_request('GET', '/admin/pages')
                            if success:
                                restored_page = next((p for p in active_pages if p.get('id') == page_id), None)
                                if restored_page and restored_page.get('status') != 'deleted':
                                    self.log_result("Pages - Verify Restored", True)
                                else:
                                    self.log_result("Pages - Verify Restored", False, "Page not found in active pages after restore")
                            
                            # Clean up - permanent delete
                            success, perm_delete_response = self.make_request('DELETE', f'/admin/pages/{page_id}', params={'permanent': True})
                            if success and perm_delete_response.get('success'):
                                self.log_result("Pages - Permanent Delete", True)
                            else:
                                self.log_result("Pages - Permanent Delete", False, f"Response: {perm_delete_response}")
                        else:
                            self.log_result("Pages - Restore from Trash", False, f"Response: {restore_response}")
                    else:
                        self.log_result("Pages - Verify in Trash with deleted_at", False, "Page not found in trash or missing deleted_at")
                else:
                    self.log_result("Pages - Verify in Trash with deleted_at", False, f"Failed to get trash: {trash_response}")
            else:
                self.log_result("Pages - Soft Delete", False, f"Response: {response}")
                
            return True
        else:
            self.log_result("Pages - Create for Trash Test", False, f"Response: {response}")
            return False

def main():
    """Main test execution"""
    tester = GltzAdminAPITester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except Exception as e:
        print(f"💥 Test execution failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())