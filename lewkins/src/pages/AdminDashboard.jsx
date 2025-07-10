import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct, getOrders, getOrderStats, updateOrderStatus } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    sizes: '',
    colors: '',
    image: '',
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch products
      const productsData = await getProducts();
      setProducts(productsData);
      
      // Fetch orders
      await fetchOrders();
      
      // Fetch order stats
      await fetchOrderStats();
    }
    fetchData();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const data = await getOrderStats();
      setOrderStats(data);
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
      image: product.image,
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      sizes: '',
      colors: '',
      image: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      sizes: formData.sizes.split(',').map((s) => s.trim()),
      colors: formData.colors.split(',').map((c) => c.trim()),
      image: formData.image,
    };
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
    } else {
      await addProduct(productData);
    }
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
    handleCancel();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    }
  };

  const updateOrderStatusLocal = async (orderId, status, trackingNumber = '', adminNotes = '') => {
    try {
      await updateOrderStatus(orderId, {
        status,
        tracking_number: trackingNumber,
        admin_notes: adminNotes
      });
      
      await fetchOrders();
      await fetchOrderStats();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-200 text-green-900';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Product Management
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-600">{orderStats.total_orders || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(orderStats.total_revenue || 0)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Pending Orders</h3>
              <p className="text-3xl font-bold text-yellow-600">{orderStats.status_counts?.pending || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Completed Orders</h3>
              <p className="text-3xl font-bold text-green-600">{orderStats.status_counts?.delivered || 0}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Order ID</th>
                    <th className="border border-gray-300 p-2 text-left">Customer</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                    <th className="border border-gray-300 p-2 text-left">Total</th>
                    <th className="border border-gray-300 p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(orderStats.recent_orders || []).map((order) => (
                    <tr key={order.id}>
                      <td className="border border-gray-300 p-2">{order.order_id}</td>
                      <td className="border border-gray-300 p-2">{order.customer_name}</td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2">{formatCurrency(order.pricing.total)}</td>
                      <td className="border border-gray-300 p-2">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">Order ID</th>
                  <th className="border border-gray-300 p-2 text-left">Customer</th>
                  <th className="border border-gray-300 p-2 text-left">Email</th>
                  <th className="border border-gray-300 p-2 text-left">Status</th>
                  <th className="border border-gray-300 p-2 text-left">Total</th>
                  <th className="border border-gray-300 p-2 text-left">Date</th>
                  <th className="border border-gray-300 p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="border border-gray-300 p-2">{order.order_id}</td>
                    <td className="border border-gray-300 p-2">{order.customer_name}</td>
                    <td className="border border-gray-300 p-2">{order.customer_email}</td>
                    <td className="border border-gray-300 p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">{formatCurrency(order.pricing.total)}</td>
                    <td className="border border-gray-300 p-2">
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Detail Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Order Details - {selectedOrder.order_id}</h3>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-semibold mb-2">Customer Information</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Name:</span> {selectedOrder.customer_name}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.customer_email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.shipping_info.phone}</p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div className="text-sm">
                      <p>{selectedOrder.shipping_info.address}</p>
                      <p>{selectedOrder.shipping_info.city}, {selectedOrder.shipping_info.province}</p>
                      <p>{selectedOrder.shipping_info.zipCode}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Order Items</h4>
                    <div className="border rounded">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between p-3 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p>Qty: {item.quantity}</p>
                            <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h4 className="font-semibold mb-2">Payment Information</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Method:</span> {selectedOrder.payment_info.method}</p>
                      <p><span className="font-medium">Status:</span> {selectedOrder.payment_info.status}</p>
                    </div>
                  </div>

                  {/* Order Status */}
                  <div>
                    <h4 className="font-semibold mb-2">Order Status</h4>
                    <div className="space-y-3">
                      <select 
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatusLocal(selectedOrder.id, e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      {selectedOrder.status === 'shipped' && (
                        <input
                          type="text"
                          placeholder="Tracking Number"
                          defaultValue={selectedOrder.tracking_number || ''}
                          onBlur={(e) => updateOrderStatusLocal(selectedOrder.id, selectedOrder.status, e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      )}
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {selectedOrder.customer_notes && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-2">Customer Notes</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.customer_notes}</p>
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Admin Notes</h4>
                    <textarea
                      defaultValue={selectedOrder.admin_notes}
                      onBlur={(e) => updateOrderStatusLocal(selectedOrder.id, selectedOrder.status, selectedOrder.tracking_number || '', e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="3"
                      placeholder="Add internal notes..."
                    />
                  </div>

                  {/* Pricing */}
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Pricing Breakdown</h4>
                    <div className="border rounded p-3 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(selectedOrder.pricing.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{formatCurrency(selectedOrder.pricing.shipping_cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(selectedOrder.pricing.tax)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedOrder.pricing.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input-field w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            className="input-field w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="input-field w-full"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="input-field w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Sizes (comma separated)</label>
          <input
            name="sizes"
            value={formData.sizes}
            onChange={handleInputChange}
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Colors (comma separated)</label>
          <input
            name="colors"
            value={formData.colors}
            onChange={handleInputChange}
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Image URL</label>
          <input
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="input-field w-full"
          />
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="btn-primary">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editingProduct && (
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">Rp {product.price.toLocaleString('id-ID')}</td>
                <td className="border border-gray-300 p-2">{product.category}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/product-preview/${product.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded-none text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                      aria-label={`Preview ${product.name}`}
                    >
                      <i className="fas fa-eye mr-1"></i>
                      Preview
                    </Link>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn-secondary px-3 py-1 text-sm"
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-none text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                    >
                      <i className="fas fa-trash mr-1"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
      )}
    </div>
  );
}
