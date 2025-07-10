import React, { useState, useEffect } from "react";
import { formatRupiah } from "../utils/formatRupiah";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category_id: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
  });
  const [variantForm, setVariantForm] = useState({
    color: "",
    size: "",
    stock: "",
    price: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);

  const API_BASE = "https://64650ebbc6bc.ngrok-free.app/api/v1";

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  };

  // Fetch data functions
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      setProducts(data.datas || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();
      setCategories(data.datas || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductDetail = async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/products/${productId}`);
      const data = await response.json();
      setVariants(data.datas?.variants || []);
      setSelectedProduct(data.datas);
    } catch (error) {
      console.error('Error fetching product detail:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('category_id', productForm.category_id);

    try {
      const url = editingProduct 
        ? `${API_BASE}/products/${editingProduct.id}`
        : `${API_BASE}/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData,
      });

      if (response.ok) {
        await fetchProducts();
        resetProductForm();
        alert(editingProduct ? 'Produk berhasil diupdate' : 'Produk berhasil dibuat');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menyimpan produk');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await fetchProducts();
        alert('Produk berhasil dihapus');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menghapus produk');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      category_id: product.category_id || "",
    });
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({ name: "", description: "", category_id: "" });
  };

  // Category CRUD
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', categoryForm.name);

    try {
      const url = editingCategory 
        ? `${API_BASE}/categories/${editingCategory.id}`
        : `${API_BASE}/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData,
      });

      if (response.ok) {
        await fetchCategories();
        resetCategoryForm();
        alert(editingCategory ? 'Kategori berhasil diupdate' : 'Kategori berhasil dibuat');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menyimpan kategori');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;

    try {
      const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await fetchCategories();
        alert('Kategori berhasil dihapus');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menghapus kategori');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name });
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "" });
  };

  // Variant CRUD
  const handleVariantSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert('Pilih produk terlebih dahulu');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('color', variantForm.color);
    formData.append('size', variantForm.size);
    formData.append('stock', variantForm.stock);
    formData.append('price', variantForm.price);

    try {
      const response = await fetch(`${API_BASE}/products/${selectedProduct.id}/variants`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (response.ok) {
        await fetchProductDetail(selectedProduct.id);
        resetVariantForm();
        alert('Variant berhasil ditambahkan');
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menambah variant');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const resetVariantForm = () => {
    setVariantForm({ color: "", size: "", stock: "", price: "" });
  };

  const renderProductsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h3>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Produk</label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({...productForm, name: e.target.value})}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              value={productForm.category_id}
              onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : (editingProduct ? 'Update' : 'Tambah')}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={resetProductForm}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Daftar Produk</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Kategori</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Harga Mulai</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.category_name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatRupiah(product.starting_price)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          fetchProductDetail(product.id);
                          setActiveTab('variants');
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Variants
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
        </h3>
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Kategori</label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              required
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : (editingCategory ? 'Update' : 'Tambah')}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={resetCategoryForm}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Daftar Kategori</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Slug</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td className="border border-gray-300 px-4 py-2">{category.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{category.slug}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editCategory(category)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVariantsTab = () => (
    <div className="space-y-6">
      {selectedProduct && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold">Produk Terpilih: {selectedProduct.name}</h3>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setVariants([]);
              setActiveTab('products');
            }}
            className="text-blue-600 text-sm hover:underline"
          >
            ← Kembali ke Daftar Produk
          </button>
        </div>
      )}

      {selectedProduct && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tambah Variant Baru</h3>
          <form onSubmit={handleVariantSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Warna</label>
                <input
                  type="text"
                  value={variantForm.color}
                  onChange={(e) => setVariantForm({...variantForm, color: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ukuran</label>
                <input
                  type="text"
                  value={variantForm.size}
                  onChange={(e) => setVariantForm({...variantForm, size: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stok</label>
                <input
                  type="number"
                  value={variantForm.stock}
                  onChange={(e) => setVariantForm({...variantForm, stock: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga</label>
                <input
                  type="number"
                  value={variantForm.price}
                  onChange={(e) => setVariantForm({...variantForm, price: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Tambah Variant'}
            </button>
          </form>
        </div>
      )}

      {selectedProduct && variants.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Daftar Variant</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Warna</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ukuran</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Stok</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Harga</th>
                </tr>
              </thead>
              <tbody>
                {variants.map(variant => (
                  <tr key={variant.id}>
                    <td className="border border-gray-300 px-4 py-2">{variant.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{variant.color}</td>
                    <td className="border border-gray-300 px-4 py-2">{variant.size}</td>
                    <td className="border border-gray-300 px-4 py-2">{variant.stock}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatRupiah(variant.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selectedProduct && (
        <div className="text-center text-gray-500 py-8">
          Pilih produk dari tab Produk untuk mengelola variant
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'products', label: 'Produk' },
            { id: 'categories', label: 'Kategori' },
            { id: 'variants', label: 'Variant' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'products' && renderProductsTab()}
      {activeTab === 'categories' && renderCategoriesTab()}
      {activeTab === 'variants' && renderVariantsTab()}
    </div>
  );
}
