// API service for handling all backend requests

const API_URL = 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Your session has expired. Please login again.');
      }

      // Handle 404 and other errors
      if (!response.ok) {
      let errorMessage = `Error: ${response.status}`;

      try {
        const errorData = await response.text();
        try {
          // Try to parse as JSON
          const jsonError = JSON.parse(errorData);
          errorMessage = jsonError.detail || jsonError.message || JSON.stringify(jsonError);
        } catch {
          // Use text if not JSON
          errorMessage = errorData;
        }
      } catch (parseError) {
        errorMessage = response.statusText;
      }

      throw new Error(errorMessage);
    }

      // For 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    return this.request('/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
  }

  async register(email, password, isAdmin = false) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, is_admin: isAdmin })
    });
  }

  async getCurrentUser() {
    return this.request('/users/me');
  }

  // Employee endpoints
  async getMyProfile() {
    return this.request('/employees/me');
  }

  async updateMyProfile(data) {
    return this.request('/employees/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getMyProjects() {
    return this.request('/employees/me/projects');
  }

  async addProject(data) {
    return this.request('/employees/me/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // NEW: Update project method
  async updateProject(projectId, data) {
    return this.request(`/employees/me/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // NEW: Delete project method
  async deleteProject(projectId) {
    return this.request(`/employees/me/projects/${projectId}`, {
      method: 'DELETE'
    });
  }

  // Admin endpoints
  async getAllEmployees() {
    return this.request('/admin/employees');
  }

  async updateEmployee(id, data) {
    return this.request(`/admin/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteEmployee(id) {
    return this.request(`/admin/employees/${id}`, {
      method: 'DELETE'
    });
  }

  async uploadEmployeeData(formData) {
    return this.request('/admin/upload', {
      method: 'POST',
      headers: {}, // Let the browser set the content type for form data
      body: formData
    });
  }
}

const api = new ApiService();
export default api;