import { Router } from 'express';
import {
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview
} from '../controllers/interviewController.js';
import { validateObjectId } from '../middleware/errorHandler.js';

const router = Router();

router.route('/')
  .get(getInterviews)
  .post(createInterview);

router.route('/:id')
  .get(validateObjectId('id'), getInterviewById)
  .patch(validateObjectId('id'), updateInterview)
  .delete(validateObjectId('id'), deleteInterview);

export default router;
