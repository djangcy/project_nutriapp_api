import express, { Router } from 'express';
import controller from '../controllers/access_token';
import methods from '../middleware/allowed_methods';

const router: Router = express.Router();

router
  .route('/new')
  .all(methods(['GET']))
  .get(controller.getAccessToken);

router
  .route('/refresh')
  .all(methods(['POST']))
  .post(controller.refreshToken);

export default router;
