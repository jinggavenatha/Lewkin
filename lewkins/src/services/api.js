// Real API service untuk Flask backend
const API_BASE_URL = 'http://127.0.0.1:5001/api';

// Token management
let authToken = localStorage.getItem('auth_token');

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getAuthToken() {
  return authToken || localStorage.getItem('auth_token');
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
}

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

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // If token expired or invalid, clear auth
      if (response.status === 401 && token) {
        clearAuthToken();
        // Optionally redirect to login
        window.location.href = '/login';
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// =============== AUTH ENDPOINTS ===============

export async function register(userData) {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      setAuthToken(response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    console.error('Error in register:', error);
    throw error;
  }
}

export async function login(credentials) {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      setAuthToken(response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
}

export async function logout() {
  clearAuthToken();
}

export async function getProfile() {
  try {
    return await apiRequest('/auth/profile');
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
}

export async function updateProfile(profileData) {
  try {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    
    // Update local user data
    localStorage.setItem('user_data', JSON.stringify(response.user));
    return response;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
}

export async function changePassword(passwordData) {
  try {
    return await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    throw error;
  }
}

export async function verifyToken() {
  try {
    return await apiRequest('/auth/verify-token', {
      method: 'POST'
    });
  } catch (error) {
    console.error('Error in verifyToken:', error);
    throw error;
  }
}

// Admin only endpoints
export async function getAllUsers() {
  try {
    return await apiRequest('/auth/users');
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}

export async function updateUserRole(userId, role) {
  try {
    return await apiRequest(`/auth/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    return await apiRequest(`/auth/users/${userId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
}

// =============== PRODUCT ENDPOINTS ===============

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
    throw error;
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

// =============== UTILITY ENDPOINTS ===============

// Health check function
export async function healthCheck() {
  try {
    return await apiRequest('/health');
  } catch (error) {
    console.error('Error in healthCheck:', error);
    throw new Error('Backend is not responding');
  }
}

// Helper functions
export function getCurrentUser() {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
}

export function isAuthenticated() {
  return !!getAuthToken();
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}
