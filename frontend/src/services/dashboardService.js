import api from './api';

export const dashboardService = {
  /**
   * Fetch aggregated dashboard summary statistics directly from MongoDB
   */
  async getSummary() {
    const response = await api.get('/dashboard/summary');
    return response?.data;
  },

  /**
   * Check backend API server and database connectivity
   */
  async getHealth() {
    const response = await api.get('/health');
    return response;
  }
};

export default dashboardService;
