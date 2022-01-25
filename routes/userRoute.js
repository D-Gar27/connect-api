import express from 'express';
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getRandomUsers,
} from '../controllers/userController.js';
import { followUser, unfollowUser } from '../controllers/followController.js';
import { authUser } from '../middleware/authUser.js';

const router = express.Router();

router.route('/').get(authUser, getAllUsers);
router.route('/random').get(authUser, getRandomUsers);
router
  .route('/:username')
  .get(authUser, getSingleUser)
  .patch(authUser, updateUser)
  .delete(authUser, deleteUser);

router.route('/:username/follow').put(followUser);
router.route('/:username/unfollow').put(unfollowUser);

export default router;
