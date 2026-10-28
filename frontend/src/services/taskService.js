import api from './api';

export const taskService = {
  /**
   * Fetch all preparation tasks with optional query filters
   */
  async getTasks(params = {}) {
    const response = await api.get('/tasks', params);
    return response?.data || [];
  },

  /**
   * Fetch single task by ID
   */
  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response?.data;
  },

  /**
   * Create a new preparation task
   */
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response?.data;
  },

  /**
   * Partially update an existing task
   */
  async updateTask(id, taskData) {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response?.data;
  },

  /**
   * Toggle task completion status
   */
  async toggleComplete(id, completed) {
    const response = await api.patch(`/tasks/${id}`, { completed });
    return response?.data;
  },

  /**
   * Delete task by ID
   */
  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response?.data;
  }
};

export default taskService;
