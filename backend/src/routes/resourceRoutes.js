import { Router } from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
} from '../controllers/resourceController.js';
import { validateObjectId } from '../middleware/errorHandler.js';

const router = Router();

router.route('/')
  .get(getResources)
  .post(createResource);

router.route('/:id')
  .get(validateObjectId('id'), getResourceById)
  .patch(validateObjectId('id'), updateResource)
  .delete(validateObjectId('id'), deleteResource);

export default router;
