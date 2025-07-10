from flask import Flask, request, jsonify
from flask_cors import CORS
from auth import auth_bp, token_required, admin_required
from order import order_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(order_bp, url_prefix='/api/orders')

# In-memory storage untuk products
products = [
    {
        "id": 1,
        "name": "Classic White T-Shirt",
        "price": 150000,
        "category": "T-Shirts",
        "image": "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
        "description": "A comfortable and stylish white t-shirt made from 100% cotton.",
        "colors": ["White", "Black", "Gray"],
        "sizes": ["XS", "S", "M", "L", "XL"]
    },
    {
        "id": 2,
        "name": "Denim Jacket",
        "price": 450000,
        "category": "Jackets",
        "image": "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
        "description": "A trendy denim jacket perfect for casual outings.",
        "colors": ["Blue", "Black"],
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": 3,
        "name": "Summer Dress",
        "price": 275000,
        "category": "Dresses",
        "image": "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg",
        "description": "A beautiful summer dress for warm weather.",
        "colors": ["Red", "Blue", "Yellow"],
        "sizes": ["XS", "S", "M", "L"]
    },
    {
        "id": 4,
        "name": "Casual Jeans",
        "price": 350000,
        "category": "Jeans",
        "image": "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
        "description": "Comfortable casual jeans for everyday wear.",
        "colors": ["Blue", "Black"],
        "sizes": ["28", "30", "32", "34", "36"]
    },
    {
        "id": 5,
        "name": "Black Sneakers",
        "price": 750000,
        "category": "Shoes",
        "image": "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
        "description": "Comfortable black sneakers with excellent support. Ideal for daily wear and light athletic activities.",
        "colors": ["Black", "White", "Gray"],
        "sizes": ["7", "8", "9", "10", "11", "12"]
    },
    {
        "id": 6,
        "name": "Leather Wallet",
        "price": 300000,
        "category": "Accessories",
        "image": "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
        "description": "Premium leather wallet with multiple card slots and bill compartments. Compact yet spacious design.",
        "colors": ["Brown", "Black"],
        "sizes": ["One Size"]
    },
    {
        "id": 7,
        "name": "Wool Sweater",
        "price": 420000,
        "category": "Sweaters",
        "image": "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
        "description": "Cozy wool sweater perfect for cold weather. Soft texture and classic design that never goes out of style.",
        "colors": ["Navy", "Gray", "Burgundy"],
        "sizes": ["S", "M", "L", "XL"]
    }
]

next_id = 8  # Counter untuk ID baru

# GET /api/products - Ambil semua products (Public)
@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

# GET /api/products/<id> - Ambil product by ID (Public)
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({'error': 'Product not found'}), 404

# POST /api/products - Tambah product baru (Admin only)
@app.route('/api/products', methods=['POST'])
@admin_required
def create_product(current_user):
    global next_id
    data = request.get_json()
    
    # Validasi required fields
    required_fields = ['name', 'price', 'category', 'description']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    
    new_product = {
        'id': next_id,
        'name': data['name'],
        'price': float(data['price']),
        'category': data['category'],
        'image': data.get('image', ''),
        'description': data['description'],
        'colors': data.get('colors', []),
        'sizes': data.get('sizes', [])
    }
    
    products.append(new_product)
    next_id += 1
    
    return jsonify(new_product), 201

# PUT /api/products/<id> - Update product (Admin only)
@app.route('/api/products/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(current_user, product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    # Update fields yang ada
    if 'name' in data:
        product['name'] = data['name']
    if 'price' in data:
        product['price'] = float(data['price'])
    if 'category' in data:
        product['category'] = data['category']
    if 'image' in data:
        product['image'] = data['image']
    if 'description' in data:
        product['description'] = data['description']
    if 'colors' in data:
        product['colors'] = data['colors']
    if 'sizes' in data:
        product['sizes'] = data['sizes']
    
    return jsonify(product)

# DELETE /api/products/<id> - Hapus product (Admin only)
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user, product_id):
    global products
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    products = [p for p in products if p['id'] != product_id]
    return jsonify({'message': 'Product deleted successfully'})

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'Flask backend is running'})

if __name__ == '__main__':
    print("🚀 Flask backend starting...")
    print("📡 API endpoints:")
    print("   GET    /api/products")
    print("   GET    /api/products/<id>")
    print("   POST   /api/products (Admin only)")
    print("   PUT    /api/products/<id> (Admin only)")
    print("   DELETE /api/products/<id> (Admin only)")
    print("   GET    /api/health")
    print("")
    print("🔐 Auth endpoints:")
    print("   POST   /api/auth/register")
    print("   POST   /api/auth/login")
    print("   GET    /api/auth/profile (Auth required)")
    print("   PUT    /api/auth/profile (Auth required)")
    print("   PUT    /api/auth/change-password (Auth required)")
    print("   GET    /api/auth/users (Admin only)")
    print("   PUT    /api/auth/users/<id>/role (Admin only)")
    print("   DELETE /api/auth/users/<id> (Admin only)")
    print("   POST   /api/auth/verify-token")
    print("")
    print("📦 Order endpoints:")
    print("   POST   /api/orders/ (Auth required)")
    print("   GET    /api/orders/ (Auth required)")
    print("   GET    /api/orders/<id> (Auth required)")
    print("   PUT    /api/orders/<id>/status (Admin only)")
    print("   GET    /api/orders/stats (Admin only)")
    print("   DELETE /api/orders/<id> (Auth required)")
    print("")
    print("👤 Default users:")
    print("   Admin: admin@lewkins.com / admin123")
    print("   User:  user@example.com / user123")
    app.run(debug=True, host='127.0.0.1', port=5001) 