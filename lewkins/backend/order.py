from flask import Blueprint, request, jsonify
from auth import token_required, admin_required
from datetime import datetime, timedelta
import uuid

order_bp = Blueprint('order', __name__)

# In-memory storage untuk orders
orders = []
next_order_id = 1

def generate_order_id():
    """Generate unique order ID dengan format LWK + timestamp"""
    return f"LWK{datetime.now().strftime('%Y%m%d%H%M%S')}"

# POST /api/orders - Create new order (Customer)
@order_bp.route('/', methods=['POST'])
@token_required
def create_order(current_user):
    global next_order_id
    data = request.get_json()
    
    # Validasi required fields
    required_fields = ['shipping_info', 'payment_info', 'items']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    
    # Validasi shipping info
    shipping_required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province', 'zipCode']
    for field in shipping_required:
        if field not in data['shipping_info']:
            return jsonify({'error': f'Missing shipping field: {field}'}), 400
    
    # Hitung total
    subtotal = sum(item['price'] * item['quantity'] for item in data['items'])
    shipping_cost = data.get('shipping_cost', 15000)
    tax_rate = data.get('tax_rate', 0.11)
    tax = subtotal * tax_rate
    total = subtotal + shipping_cost + tax
    
    # Estimasi delivery date (7 hari dari sekarang)
    estimated_delivery = (datetime.now() + timedelta(days=7)).isoformat()
    
    new_order = {
        'id': next_order_id,
        'order_id': generate_order_id(),
        'customer_id': current_user['id'],
        'customer_name': f"{data['shipping_info']['firstName']} {data['shipping_info']['lastName']}",
        'customer_email': data['shipping_info']['email'],
        'status': 'pending',
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat(),
        'shipping_info': data['shipping_info'],
        'payment_info': {
            'method': data['payment_info']['paymentMethod'],
            'status': 'pending'
        },
        'items': data['items'],
        'pricing': {
            'subtotal': subtotal,
            'shipping_cost': shipping_cost,
            'tax': tax,
            'total': total
        },
        'tracking_number': None,
        'estimated_delivery': estimated_delivery,
        'admin_notes': '',
        'customer_notes': data.get('customer_notes', '')
    }
    
    orders.append(new_order)
    next_order_id += 1
    
    return jsonify({
        'message': 'Order created successfully',
        'order': new_order
    }), 201

# GET /api/orders - Get all orders (Admin) atau user orders (Customer)
@order_bp.route('/', methods=['GET'])
@token_required
def get_orders(current_user):
    if current_user['role'] == 'admin':
        # Admin bisa lihat semua orders
        return jsonify(orders)
    else:
        # Customer hanya bisa lihat orders mereka sendiri
        user_orders = [order for order in orders if order['customer_id'] == current_user['id']]
        return jsonify(user_orders)

# GET /api/orders/<id> - Get specific order
@order_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    order = next((o for o in orders if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Check permission
    if current_user['role'] != 'admin' and order['customer_id'] != current_user['id']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(order)

# PUT /api/orders/<id>/status - Update order status (Admin only)
@order_bp.route('/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(current_user, order_id):
    order = next((o for o in orders if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    data = request.get_json()
    valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    
    if 'status' not in data or data['status'] not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
    
    order['status'] = data['status']
    order['updated_at'] = datetime.now().isoformat()
    
    # Update tracking number jika ada
    if 'tracking_number' in data:
        order['tracking_number'] = data['tracking_number']
    
    # Update admin notes jika ada
    if 'admin_notes' in data:
        order['admin_notes'] = data['admin_notes']
    
    return jsonify(order)

# GET /api/orders/stats - Get order statistics (Admin only)
@order_bp.route('/stats', methods=['GET'])
@admin_required
def get_order_stats(current_user):
    total_orders = len(orders)
    total_revenue = sum(order['pricing']['total'] for order in orders if order['status'] != 'cancelled')
    
    status_counts = {}
    for order in orders:
        status = order['status']
        status_counts[status] = status_counts.get(status, 0) + 1
    
    # Recent orders (last 10)
    recent_orders = sorted(orders, key=lambda x: x['created_at'], reverse=True)[:10]
    
    return jsonify({
        'total_orders': total_orders,
        'total_revenue': total_revenue,
        'status_counts': status_counts,
        'recent_orders': recent_orders
    })

# DELETE /api/orders/<id> - Cancel order
@order_bp.route('/<int:order_id>', methods=['DELETE'])
@token_required
def cancel_order(current_user, order_id):
    order = next((o for o in orders if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Check permission
    if current_user['role'] != 'admin' and order['customer_id'] != current_user['id']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Only allow cancellation if order is still pending or processing
    if order['status'] in ['shipped', 'delivered']:
        return jsonify({'error': 'Cannot cancel order that has been shipped or delivered'}), 400
    
    order['status'] = 'cancelled'
    order['updated_at'] = datetime.now().isoformat()
    
    return jsonify({'message': 'Order cancelled successfully', 'order': order})
