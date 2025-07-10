// Base URL from Postman collection
const BASE_URL = 'https://64650ebbc6bc.ngrok-free.app/api/v1';

// Create axios instance for API calls
import axios from 'axios';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export async function registerUser(userData) {
  try {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('role', userData.role || 'pembeli');

    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export async function loginUser(credentials) {
  try {
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { access_token } = response.data;
    
    // Store token
    localStorage.setItem('jwt_token', access_token);
    
    // Decode JWT to get user info
    const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
    const userInfo = {
      id: tokenPayload.sub,
      role: tokenPayload.role,
      email: credentials.email
    };
    
    // Store user info
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    return { token: access_token, user: userInfo };
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export function logoutUser() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('userInfo');
}

// Category APIs
export async function getCategories() {
  try {
    const response = await api.get('/categories/');
    return response.data;
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw new Error('Failed to fetch categories');
  }
}

export async function createCategory(categoryData) {
  try {
    const formData = new FormData();
    formData.append('name', categoryData.name);

    const response = await api.post('/categories/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw new Error(error.response?.data?.message || 'Failed to create category');
  }
}

export async function updateCategory(categoryId, categoryData) {
  try {
    const formData = new FormData();
    formData.append('name', categoryData.name);

    const response = await api.put(`/categories/${categoryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in updateCategory:', error);
    throw new Error(error.response?.data?.message || 'Failed to update category');
  }
}

export async function deleteCategory(categoryId) {
  try {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete category');
  }
}

// Product APIs
export async function getProductsFromAPI() {
  try {
    const response = await api.get('/products/');
    return response.data;
  } catch (error) {
    console.error('Error in getProductsFromAPI:', error);
    throw new Error('Failed to fetch products from API');
  }
}

export async function getProductDetail(productId) {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getProductDetail:', error);
    throw new Error('Failed to fetch product detail');
  }
}

export async function createProduct(productData) {
  try {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('category_id', productData.category_id);

    const response = await api.post('/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
}

export async function updateProduct(productId, productData) {
  try {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('category_id', productData.category_id);

    const response = await api.put(`/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
}

export async function createProductVariant(productId, variantData) {
  try {
    const formData = new FormData();
    formData.append('color', variantData.color);
    formData.append('size', variantData.size);
    formData.append('stock', variantData.stock);
    formData.append('price', variantData.price);

    const response = await api.post(`/products/${productId}/variants`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createProductVariant:', error);
    throw new Error(error.response?.data?.message || 'Failed to create product variant');
  }
}

export async function uploadProductImage(productId, imageFile) {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload product image');
  }
}

// Cart APIs
export async function getCart() {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error in getCart:', error);
    throw new Error('Failed to fetch cart');
  }
}

export async function addToCart(cartData) {
  try {
    const formData = new FormData();
    formData.append('variant_id', cartData.variant_id);
    formData.append('quantity', cartData.quantity);

    const response = await api.post('/cart', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in addToCart:', error);
    throw new Error(error.response?.data?.message || 'Failed to add item to cart');
  }
}

export async function updateCartItem(itemId, quantity) {
  try {
    const formData = new FormData();
    formData.append('quantity', quantity);

    const response = await api.put(`/cart/item/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    throw new Error(error.response?.data?.message || 'Failed to update cart item');
  }
}

export async function removeCartItem(itemId) {
  try {
    const response = await api.delete(`/cart/item/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error in removeCartItem:', error);
    throw new Error(error.response?.data?.message || 'Failed to remove cart item');
  }
}

// Order APIs
export async function getOrders() {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error in getOrders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function createOrder(orderData) {
  try {
    const formData = new FormData();
    formData.append('shipping_address', orderData.shipping_address);
    formData.append('shipping_method', orderData.shipping_method);

    const response = await api.post('/orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const formData = new FormData();
    formData.append('status', status);

    const response = await api.put(`/orders/${orderId}/status`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
}

// Payment API
export async function processPayment(orderId) {
  try {
    const response = await api.post(`/payments/${orderId}/pay`);
    return response.data;
  } catch (error) {
    console.error('Error in processPayment:', error);
    throw new Error(error.response?.data?.message || 'Failed to process payment');
  }
}

// Mock data for demonstration - replace with real API endpoints
const mockProducts = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 55000,
    category: "T-Shirts",
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
    description: "A comfortable and stylish white t-shirt made from 100% cotton.",
    colors: ["White", "Black", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: 128000,
    category: "Jackets",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
    description: "A trendy denim jacket perfect for casual outings.",
    colors: ["Blue", "Black"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Summer Dress",
    price: 230000,
    category: "Dresses",
    image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg",
    description: "A beautiful summer dress for warm weather.",
    colors: ["Red", "Blue", "Yellow"],
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 4,
    name: "Casual Jeans",
    price: 70000,
    category: "Jeans",
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
    description: "Comfortable casual jeans for everyday wear.",
    colors: ["Blue", "Black"],
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 5,
    name: "Black Sneakers",
    price: 400000,
    category: "Shoes",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    description: "Comfortable black sneakers with excellent support. Ideal for daily wear and light athletic activities.",
    colors: ["Black", "White", "Gray"],
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: 6,
    name: "Leather Wallet",
    price: 420000,
    category: "Accessories",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
    description: "Premium leather wallet with multiple card slots and bill compartments. Compact yet spacious design.",
    colors: ["Brown", "Black"],
    sizes: ["One Size"]
  },
  {
    id: 7,
    name: "Wool Sweater",
    price: 699000,
    category: "Sweaters",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
    description: "Cozy wool sweater perfect for cold weather. Soft texture and classic design that never goes out of style.",
    colors: ["Navy", "Gray", "Burgundy"],
    sizes: ["S", "M", "L", "XL"]
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback functions for mock data (keep existing functionality)
export async function getProducts() {
  try {
    await delay(500); // Simulate network delay
    return mockProducts;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductById(id) {
  try {
    await delay(300); // Simulate network delay
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw error;
  }
}

export async function addProduct(product) {
  try {
    await delay(500);
    const newProduct = {
      ...product,
      id: Math.max(...mockProducts.map(p => p.id)) + 1
    };
    mockProducts.push(newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw new Error('Failed to add product');
  }
}

export async function updateProductMock(id, updatedProduct) {
  try {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    mockProducts[index] = { ...mockProducts[index], ...updatedProduct };
    return mockProducts[index];
  } catch (error) {
    console.error('Error in updateProductMock:', error);
    throw error;
  }
}

export async function deleteProductMock(id) {
  try {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    const deletedProduct = mockProducts.splice(index, 1)[0];
    return deletedProduct;
  } catch (error) {
    console.error('Error in deleteProductMock:', error);
    throw error;
  }
}
