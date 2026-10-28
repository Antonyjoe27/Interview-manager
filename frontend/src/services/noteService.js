import api from './api';

export const noteService = {
  /**
   * Fetch all revision notes with optional subject or favorite filters
   */
  async getNotes(params = {}) {
    const response = await api.get('/notes', params);
    return response?.data || [];
  },

  /**
   * Fetch single note by ID
   */
  async getNoteById(id) {
    const response = await api.get(`/notes/${id}`);
    return response?.data;
  },

  /**
   * Create a new revision note
   */
  async createNote(noteData) {
    const response = await api.post('/notes', noteData);
    return response?.data;
  },

  /**
   * Update an existing note
   */
  async updateNote(id, noteData) {
    const response = await api.patch(`/notes/${id}`, noteData);
    return response?.data;
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id, favorite) {
    const response = await api.patch(`/notes/${id}`, { favorite });
    return response?.data;
  },

  /**
   * Toggle pinned status
   */
  async togglePin(id, pinned) {
    const response = await api.patch(`/notes/${id}`, { pinned });
    return response?.data;
  },

  /**
   * Delete a note by ID
   */
  async deleteNote(id) {
    const response = await api.delete(`/notes/${id}`);
    return response?.data;
  }
};

export default noteService;
