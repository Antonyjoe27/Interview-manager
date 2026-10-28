import api from './api';

export const resourceService = {
  /**
   * Fetch all learning resources with optional category or subject filters
   */
  async getResources(params = {}) {
    const response = await api.get('/resources', params);
    return response?.data || [];
  },

  /**
   * Fetch single resource by ID
   */
  async getResourceById(id) {
    const response = await api.get(`/resources/${id}`);
    return response?.data;
  },

  /**
   * Create a new learning resource
   */
  async createResource(resourceData) {
    const response = await api.post('/resources', resourceData);
    return response?.data;
  },

  /**
   * Update an existing resource
   */
  async updateResource(id, resourceData) {
    const response = await api.patch(`/resources/${id}`, resourceData);
    return response?.data;
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id, favorite) {
    const response = await api.patch(`/resources/${id}`, { favorite });
    return response?.data;
  },

  /**
   * Delete a resource by ID
   */
  async deleteResource(id) {
    const response = await api.delete(`/resources/${id}`);
    return response?.data;
  }
};

export default resourceService;
