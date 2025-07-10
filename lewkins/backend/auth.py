from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

# Blueprint untuk auth routes
auth_bp = Blueprint('auth', __name__)

# Secret key untuk JWT (dalam production, simpan di environment variable)
JWT_SECRET = 'your-secret-key-change-this-in-production'

# In-memory storage untuk users
users = [
    {
        'id': 1,
        'email': 'admin@lewkins.com',
        'password': generate_password_hash('admin123'),
        'name': 'Admin User',
        'role': 'admin',
        'created_at': datetime.datetime.utcnow().isoformat()
    },
    {
        'id': 2,
        'email': 'user@example.com',
        'password': generate_password_hash('user123'),
        'name': 'Regular User',
        'role': 'buyer',
        'created_at': datetime.datetime.utcnow().isoformat()
    }
]

next_user_id = 3

def generate_token(user_id, role):
    """Generate JWT token"""
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator untuk routes yang butuh authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = verify_token(token)
        if not payload:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        
        # Cari user berdasarkan token payload
        user = next((u for u in users if u['id'] == payload['user_id']), None)
        if not user:
            return jsonify({'error': 'User not found'}), 401
        
        # Pass user info ke function
        return f(current_user=user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    """Decorator untuk routes yang butuh admin access"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = verify_token(token)
        if not payload:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        
        if payload['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        user = next((u for u in users if u['id'] == payload['user_id']), None)
        if not user:
            return jsonify({'error': 'User not found'}), 401
        
        return f(current_user=user, *args, **kwargs)
    
    return decorated

# POST /api/auth/register - Register user baru
@auth_bp.route('/register', methods=['POST'])
def register():
    global next_user_id
    data = request.get_json()
    
    # Validasi input
    required_fields = ['email', 'password', 'name']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing field: {field}'}), 400
    
    email = data['email'].lower().strip()
    password = data['password']
    name = data['name'].strip()
    role = data.get('role', 'buyer')  # Default role buyer
    
    # Validasi email format sederhana
    if '@' not in email or '.' not in email:
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validasi password minimum length
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    # Cek apakah email sudah terdaftar
    if any(u['email'] == email for u in users):
        return jsonify({'error': 'Email already registered'}), 400
    
    # Validasi role
    if role not in ['buyer', 'admin']:
        return jsonify({'error': 'Invalid role. Must be buyer or admin'}), 400
    
    # Buat user baru
    new_user = {
        'id': next_user_id,
        'email': email,
        'password': generate_password_hash(password),
        'name': name,
        'role': role,
        'created_at': datetime.datetime.utcnow().isoformat()
    }
    
    users.append(new_user)
    next_user_id += 1
    
    # Generate token
    token = generate_token(new_user['id'], new_user['role'])
    
    # Return user info tanpa password
    user_info = {k: v for k, v in new_user.items() if k != 'password'}
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user_info,
        'token': token
    }), 201

# POST /api/auth/login - Login user
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    email = data['email'].lower().strip()
    password = data['password']
    
    # Cari user berdasarkan email
    user = next((u for u in users if u['email'] == email), None)
    
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Generate token
    token = generate_token(user['id'], user['role'])
    
    # Return user info tanpa password
    user_info = {k: v for k, v in user.items() if k != 'password'}
    
    return jsonify({
        'message': 'Login successful',
        'user': user_info,
        'token': token
    })

# GET /api/auth/profile - Get current user profile
@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    user_info = {k: v for k, v in current_user.items() if k != 'password'}
    return jsonify(user_info)

# PUT /api/auth/profile - Update current user profile
@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    # Update fields yang diizinkan
    if 'name' in data:
        current_user['name'] = data['name'].strip()
    
    if 'email' in data:
        new_email = data['email'].lower().strip()
        # Cek apakah email sudah dipakai user lain
        if any(u['email'] == new_email and u['id'] != current_user['id'] for u in users):
            return jsonify({'error': 'Email already taken'}), 400
        current_user['email'] = new_email
    
    user_info = {k: v for k, v in current_user.items() if k != 'password'}
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user_info
    })

# PUT /api/auth/change-password - Change password
@auth_bp.route('/change-password', methods=['PUT'])
@token_required
def change_password(current_user):
    data = request.get_json()
    
    if not data.get('current_password') or not data.get('new_password'):
        return jsonify({'error': 'Current password and new password are required'}), 400
    
    current_password = data['current_password']
    new_password = data['new_password']
    
    # Verifikasi current password
    if not check_password_hash(current_user['password'], current_password):
        return jsonify({'error': 'Current password is incorrect'}), 400
    
    # Validasi new password
    if len(new_password) < 6:
        return jsonify({'error': 'New password must be at least 6 characters'}), 400
    
    # Update password
    current_user['password'] = generate_password_hash(new_password)
    
    return jsonify({'message': 'Password changed successfully'})

# GET /api/auth/users - Get all users (Admin only)
@auth_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    users_info = [{k: v for k, v in user.items() if k != 'password'} for user in users]
    return jsonify(users_info)

# PUT /api/auth/users/<user_id>/role - Update user role (Admin only)
@auth_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@admin_required
def update_user_role(current_user, user_id):
    data = request.get_json()
    
    if not data.get('role'):
        return jsonify({'error': 'Role is required'}), 400
    
    new_role = data['role']
    if new_role not in ['buyer', 'admin']:
        return jsonify({'error': 'Invalid role. Must be buyer or admin'}), 400
    
    # Cari user yang akan diupdate
    target_user = next((u for u in users if u['id'] == user_id), None)
    if not target_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Update role
    target_user['role'] = new_role
    
    user_info = {k: v for k, v in target_user.items() if k != 'password'}
    return jsonify({
        'message': 'User role updated successfully',
        'user': user_info
    })

# DELETE /api/auth/users/<user_id> - Delete user (Admin only)
@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    global users
    
    # Cek apakah user exists
    target_user = next((u for u in users if u['id'] == user_id), None)
    if not target_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Tidak bisa delete diri sendiri
    if target_user['id'] == current_user['id']:
        return jsonify({'error': 'Cannot delete your own account'}), 400
    
    # Delete user
    users = [u for u in users if u['id'] != user_id]
    
    return jsonify({'message': 'User deleted successfully'})

# POST /api/auth/verify-token - Verify token validity
@auth_bp.route('/verify-token', methods=['POST'])
def verify_token_endpoint():
    token = request.headers.get('Authorization')
    
    if not token:
        return jsonify({'valid': False, 'error': 'Token is missing'}), 401
    
    if token.startswith('Bearer '):
        token = token[7:]
    
    payload = verify_token(token)
    if not payload:
        return jsonify({'valid': False, 'error': 'Token is invalid or expired'}), 401
    
    user = next((u for u in users if u['id'] == payload['user_id']), None)
    if not user:
        return jsonify({'valid': False, 'error': 'User not found'}), 401
    
    user_info = {k: v for k, v in user.items() if k != 'password'}
    return jsonify({
        'valid': True,
        'user': user_info
    })
