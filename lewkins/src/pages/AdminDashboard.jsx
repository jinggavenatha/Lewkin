import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/api';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    sizes: '',
    colors: '',
    image: '',
    stock: '',
  });

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : '',
      colors: Array.isArray(product.colors) ? product.colors.join(',') : '',
      image: product.image,
      stock: product.stock || 0,
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      sizes: '',
      colors: '',
      image: '',
      stock: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      sizes: formData.sizes ? formData.sizes.split(',').map((s) => s.trim()).filter(s => s) : [],
      colors: formData.colors ? formData.colors.split(',').map((c) => c.trim()).filter(c => c) : [],
      image: formData.image,
      stock: parseInt(formData.stock) || 0,
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

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard - Product Management</h1>
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
          <label className="block font-semibold mb-1">Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="input-field w-full"
            placeholder="e.g., T-Shirts, Jeans, Shoes"
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
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleInputChange}
            className="input-field w-full"
            placeholder="0"
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
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Stock</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">{product.category}</td>
                <td className="border border-gray-300 p-2">${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || 0).toFixed(2)}</td>
                <td className="border border-gray-300 p-2">{product.stock || 0}</td>
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
  );
}
