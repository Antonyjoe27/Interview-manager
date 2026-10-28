import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
} from '../controllers/applicationController.js';
import { validateObjectId } from '../middleware/errorHandler.js';

const router = Router();

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/:id')
  .get(validateObjectId('id'), getApplicationById)
  .patch(validateObjectId('id'), updateApplication)
  .delete(validateObjectId('id'), deleteApplication);

export default router;
