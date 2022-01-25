import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';

//---- Routers -----

import UserRouter from './routes/userRoute.js';
import AuthRouter from './routes/authRoute.js';
import PostRouter from './routes/postRoute.js';
import ChatRouter from './routes/chatRoute.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
dotenv.config();

//---- Middleware -------

app.use(express.json());
app.use(cors());
app.use(helmet());

//---- Routes ------

app.get('/', (req, res) => res.status(200).send('<h2>Server is running</h2>'));
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1', PostRouter);
app.use('/api/v1/chat', ChatRouter);

//------- Socket IO -----

let onlineUsers = [];

const addUser = (username, socketID) => {
  if (!onlineUsers.some((user) => user?.username === username)) {
    onlineUsers.push({ username, socketID });
  }
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

const removeUser = (socketID) => {
  onlineUsers = onlineUsers.filter((user) => user.socketID !== socketID);
};

io.on('connection', (socket) => {
  console.log(`User connected with the socket id (${socket.id})`);

  socket.on('add_user', (username) => {
    addUser(username, socket.id);
    io.emit('get_online_users', onlineUsers);
  });

  // socket.on('send_msg', ({ sender, receiver, text }) => {
  //   const user = getUser(receiver);

  //   // const soc = { id: user?.socketID };
  //   const message = { sender, receiver, text };
  //   io.emit('receive_msg', message);
  // });

  socket.on('disconnect', () => {
    console.log('disconnected');
    removeUser(socket.id);
    io.emit('get_online_users', onlineUsers);
  });
});

//----- Connect To DB ------

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    server.listen(port, () =>
      console.log(`Server is running on port [ ${port} ]`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
