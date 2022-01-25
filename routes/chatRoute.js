import {
  createChat,
  deleteChat,
  getChat,
} from '../controllers/chatController.js';
import express from 'express';
import { addMessage, getAllMessage } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createChat);
router.get('/:username', getChat);
router.delete('/:chatID', deleteChat);

router.post('/messages', addMessage);
router.get('/messages/:chatID', getAllMessage);

export default router;
