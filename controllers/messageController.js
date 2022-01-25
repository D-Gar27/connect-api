import Message from '../models/Message.js';

const addMessage = async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.status(200).json(msg);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getAllMessage = async (req, res) => {
  const chatID = req.params.chatID;
  try {
    const msgs = await Message.find({ chatID });
    res.status(200).json(msgs);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { addMessage, getAllMessage };
