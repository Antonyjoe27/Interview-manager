import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { validateObjectId } from '../middleware/errorHandler.js';

const router = Router();

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(validateObjectId('id'), getTaskById)
  .patch(validateObjectId('id'), updateTask)
  .delete(validateObjectId('id'), deleteTask);

export default router;
