import api from './api';

export const interviewService = {
  /**
   * Fetch all scheduled interviews with optional filters
   */
  async getInterviews(params = {}) {
    const response = await api.get('/interviews', params);
    return response?.data || [];
  },

  /**
   * Fetch single interview by ID
   */
  async getInterviewById(id) {
    const response = await api.get(`/interviews/${id}`);
    return response?.data;
  },

  /**
   * Schedule a new interview
   */
  async createInterview(interviewData) {
    const response = await api.post('/interviews', interviewData);
    return response?.data;
  },

  /**
   * Update an existing interview (reschedule, change status, notes)
   */
  async updateInterview(id, interviewData) {
    const response = await api.patch(`/interviews/${id}`, interviewData);
    return response?.data;
  },

  /**
   * Delete an interview by ID
   */
  async deleteInterview(id) {
    const response = await api.delete(`/interviews/${id}`);
    return response?.data;
  }
};

export default interviewService;
