import express from 'express';
import {
  createPosts,
  deletePosts,
  editPost,
  getPost,
  likePost,
  getWallPost,
  getFeedPosts,
} from '../controllers/postController.js';
import { authUser } from '../middleware/authUser.js';
import {
  deleteComment,
  addComment,
  editComment,
  getComments,
} from '../controllers/commentController.js';

const router = express.Router();

router.route('/posts').post(authUser, createPosts);

router
  .route('/posts/:postID')
  .get(authUser, getPost)
  .patch(authUser, editPost)
  .delete(authUser, deletePosts);

router.route('/posts/:postID/like').put(authUser, likePost);

router.route('/posts/:postID/addComment').post(authUser, addComment);
router.route('/posts/:postID/comments').get(authUser, getComments);
router
  .route('/comments/:commentID')
  .delete(authUser, deleteComment)
  .patch(authUser, editComment);

router.route('/users/:username/posts').get(authUser, getWallPost);

router.route('/feed').get(authUser, getFeedPosts);

export default router;
