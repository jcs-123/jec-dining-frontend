const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jec-dining-backend.onrender.com/api';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // If formData, let browser set Content-Type with boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // Attach token from localStorage if present
  const localToken = localStorage.getItem('token');
  if (localToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${localToken}`;
  }

  // Attach cafe slug for proper server scoping
  if (!headers['X-Cafe-Slug']) {
    const isBytes = window.location.pathname.toLowerCase().includes('byte') || localStorage.getItem('selectedCafe') === 'jecbytes';
    headers['X-Cafe-Slug'] = isBytes ? 'jecbytes' : 'jeccafe';
  }

  // Attach CSRF token if present
  const csrfToken = getCookie('XSRF-TOKEN');
  if (csrfToken) {
    headers['X-XSRF-TOKEN'] = csrfToken;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' // Always include HttpOnly cookies
  };

  try {
    const response = await fetch(url, config);

    // If downloading file (CSV/blob)
    if (options.responseType === 'blob') {
      if (!response.ok) {
        throw new Error('Failed to download export file');
      }
      return await response.blob();
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || (data.errors ? data.errors.join(', ') : 'An error occurred');
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check your network connection.');
    }
    throw error;
  }
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, {
    ...options,
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body)
  }),
  put: (endpoint, body, options = {}) => request(endpoint, {
    ...options,
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body)
  }),
  patch: (endpoint, body, options = {}) => request(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined
  }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
  download: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET', responseType: 'blob' })
};
