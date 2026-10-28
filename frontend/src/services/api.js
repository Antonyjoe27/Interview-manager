/**
 * Centralized API Client & Fetch Request Utilities
 * Interview Preparation Tracker
 */

const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL ||
  (import.meta.env?.DEV ? 'http://localhost:5000/api' : '/api')
).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Builds a query string from an object, skipping undefined, null, or empty string values.
 */
function buildQueryString(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, String(val));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Core HTTP Request wrapper around native Fetch
 */
export async function request(endpoint, options = {}) {
  const { params, body, headers = {}, ...customConfig } = options;

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}${buildQueryString(params)}`;

  const config = {
    method: options.method || (body ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    ...customConfig
  };

  if (body && typeof body === 'object') {
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new ApiError(
      'Unable to connect to the backend server. Please verify the Express API is running at ' + API_BASE_URL,
      0,
      err
    );
  }

  // Handle No Content response
  if (response.status === 204) {
    return null;
  }

  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      response.statusText ||
      `Request failed with status ${response.status}`;

    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

export const api = {
  get: (endpoint, params, options) => request(endpoint, { method: 'GET', params, ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options })
};

export default api;
