import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

const createChat = async (req, res) => {
  try {
    const isUserExist = await Chat.find({
      members: { $in: [req.body.sender] },
    });
    const isChatExist = isUserExist.find((chat) =>
      chat?.members?.includes(req.body.receiver)
    );
    if (isChatExist) {
      return res.status(200).json(isChatExist);
    } else {
      const chat = await Chat.create({
        members: [req.body.sender, req.body.receiver],
      });
      return res.status(201).json(chat);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getChat = async (req, res) => {
  const userName = req.params.username;
  try {
    const chats = await Chat.find({ members: { $in: [userName] } });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const deleteChat = async (req, res) => {
  const chatID = req.params.chatID;
  try {
    await Chat.findByIdAndDelete(chatID);
    await Message.deleteMany({ chatID: chatID });
    res.status(200).json('deleted');
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { createChat, getChat, deleteChat };
