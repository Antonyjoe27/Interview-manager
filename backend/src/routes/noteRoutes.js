import { Router } from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/noteController.js';
import { validateObjectId } from '../middleware/errorHandler.js';

const router = Router();

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(validateObjectId('id'), getNoteById)
  .patch(validateObjectId('id'), updateNote)
  .delete(validateObjectId('id'), deleteNote);

export default router;
