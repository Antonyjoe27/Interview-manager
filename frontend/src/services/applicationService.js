import api from './api';

export const applicationService = {
  /**
   * Fetch all job applications with optional pipeline filters
   */
  async getApplications(params = {}) {
    const response = await api.get('/applications', params);
    return response?.data || [];
  },

  /**
   * Fetch single job application by ID
   */
  async getApplicationById(id) {
    const response = await api.get(`/applications/${id}`);
    return response?.data;
  },

  /**
   * Create a new job application
   */
  async createApplication(applicationData) {
    const response = await api.post('/applications', applicationData);
    return response?.data;
  },

  /**
   * Update an existing job application
   */
  async updateApplication(id, applicationData) {
    const response = await api.patch(`/applications/${id}`, applicationData);
    return response?.data;
  },

  /**
   * Quick status change (Wishlist, Applied, Assessment, Interview, Offer, Rejected, Withdrawn)
   */
  async updateStatus(id, status) {
    const response = await api.patch(`/applications/${id}`, { status });
    return response?.data;
  },

  /**
   * Delete an application by ID
   */
  async deleteApplication(id) {
    const response = await api.delete(`/applications/${id}`);
    return response?.data;
  }
};

export default applicationService;
