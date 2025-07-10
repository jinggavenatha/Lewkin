#!/usr/bin/env python3
"""
Simple test script untuk auth endpoints
Jalankan: python test_auth.py
"""

import requests
import json

BASE_URL = "http://127.0.0.1:5001/api"

def test_health():
    """Test health endpoint"""
    print("🏥 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_register():
    """Test user registration"""
    print("📝 Testing user registration...")
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 201:
        data = response.json()
        return data.get('token')
    print()
    return None

def test_login():
    """Test user login"""
    print("🔐 Testing user login...")
    login_data = {
        "email": "admin@lewkins.com",
        "password": "admin123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        data = response.json()
        return data.get('token')
    print()
    return None

def test_protected_endpoint(token):
    """Test protected endpoint dengan token"""
    print("🔒 Testing protected endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_admin_endpoint(token):
    """Test admin-only endpoint"""
    print("👑 Testing admin endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/auth/users", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_products_crud(token):
    """Test product CRUD dengan admin token"""
    print("📦 Testing product CRUD...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test create product (admin only)
    product_data = {
        "name": "Test Product",
        "price": 99.99,
        "category": "Test",
        "description": "A test product",
        "colors": ["Red", "Blue"],
        "sizes": ["M", "L"]
    }
    
    response = requests.post(f"{BASE_URL}/products", json=product_data, headers=headers)
    print(f"Create Product - Status: {response.status_code}")
    if response.status_code == 201:
        product = response.json()
        product_id = product['id']
        print(f"Created product ID: {product_id}")
        
        # Test update product
        update_data = {"price": 79.99}
        response = requests.put(f"{BASE_URL}/products/{product_id}", json=update_data, headers=headers)
        print(f"Update Product - Status: {response.status_code}")
        
        # Test delete product
        response = requests.delete(f"{BASE_URL}/products/{product_id}", headers=headers)
        print(f"Delete Product - Status: {response.status_code}")
    print()

if __name__ == "__main__":
    print("🚀 Testing Lewkins Auth API")
    print("=" * 40)
    
    # Test health
    test_health()
    
    # Test login untuk admin
    admin_token = test_login()
    
    if admin_token:
        print(f"✅ Got admin token: {admin_token[:20]}...")
        test_protected_endpoint(admin_token)
        test_admin_endpoint(admin_token)
        test_products_crud(admin_token)
    else:
        print("❌ Failed to get admin token")
    
    # Test register new user
    # test_register()
    
    print("🏁 Testing completed!") 