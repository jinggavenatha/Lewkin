// Real API service untuk Flask backend
const API_BASE_URL = 'http://127.0.0.1:5001/api';

// Helper function untuk handle HTTP requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

export async function getProducts() {
  try {
    return await apiRequest('/products');
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductById(id) {
  try {
    return await apiRequest(`/products/${id}`);
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw error;
  }
}

export async function addProduct(product) {
  try {
    return await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw new Error('Failed to add product');
  }
}

export async function updateProduct(id, updatedProduct) {
  try {
    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedProduct)
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
}

// Health check function
export async function healthCheck() {
  try {
    return await apiRequest('/health');
  } catch (error) {
    console.error('Error in healthCheck:', error);
    throw new Error('Backend is not responding');
  }
}
