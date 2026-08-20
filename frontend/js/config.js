// Dynamically select API URL: relative URL if hosted together, or local backend URL for dev
const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:8000/api/auth'
  : `${window.location.origin}/api/auth`;

async function apiFetch(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Includes HttpOnly session cookies
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMsg = 'An unexpected error occurred.';
      if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (Array.isArray(data.detail) && data.detail.length > 0) {
        errorMsg = data.detail.map(err => err.msg || 'Validation error').join(', ');
      } else if (data.message) {
        errorMsg = data.message;
      }
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Unable to reach server. Please ensure backend is running.');
    }
    throw error;
  }
}
