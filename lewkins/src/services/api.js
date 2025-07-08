// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data; // Return the data property from response
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Product API functions
export async function getProducts() {
  return await apiRequest('/products');
}

export async function getProductById(id) {
  return await apiRequest(`/products/${id}`);
}

export async function getProductsByCategory(category) {
  return await apiRequest(`/products/category/${category}`);
}

export async function searchProducts(query) {
  return await apiRequest(`/products/search?q=${encodeURIComponent(query)}`);
}

export async function addProduct(product) {
  return await apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, updatedProduct) {
  return await apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedProduct),
  });
}

export async function deleteProduct(id) {
  return await apiRequest(`/products/${id}`, {
    method: 'DELETE',
  });
}

// Health check functions
export async function testConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Backend connection failed:', error);
    throw error;
  }
}
