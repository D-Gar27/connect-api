import express from 'express';
import {
  checkPassword,
  registerUser,
  signInUser,
} from '../controllers/authController.js';
import { authUser } from '../middleware/authUser.js';

const router = express.Router();

router.route('/sign-in').post(signInUser);
router.route('/sign-up').post(registerUser);
router.route('/check-password').post(authUser, checkPassword);

export default router;
