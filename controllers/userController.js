import Users from '../models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 0;
  const username = req.query.username;
  const limit = 30;
  try {
    const users = await Users.find({ username })
      .skip(limit * page - 1)
      .limit(limit);
    if (users.length > 0) {
      const dataToSend = users.map((user) => {
        const { password, createdAt, ...rest } = user._doc;
        return rest;
      });
      return res.status(200).json(dataToSend);
    }
    return res.status(404).json('Users not found');
  } catch (error) {
    res.status(500).json({ username });
  }
};

const getSingleUser = async (req, res) => {
  const paramsUsername = req.params.username;

  try {
    const user = await Users.findOne({ username: paramsUsername });
    const { password, updatedAt, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateUser = async (req, res) => {
  const paramsUsername = req.params.username;
  const reqUsername = req.username.username;
  try {
    if (paramsUsername !== reqUsername)
      return res.status(403).json('You are not allowed to modify');
    const { password: PW, ...rest } = req.body;
    let password = '';
    let user;
    if (PW) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(PW, salt);
      const toUpdate = { ...rest, password };
      user = await Users.findOneAndUpdate({ username: reqUsername }, toUpdate, {
        new: true,
      });
    } else {
      user = await Users.findOneAndUpdate({ username: reqUsername }, req.body, {
        new: true,
      });
    }
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );
    res.status(200).json({ username: user.username, token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const deleteUser = async (req, res) => {
  const paramsUsername = req.params.username;
  const reqUsername = req.username.username;
  try {
    if (paramsUsername !== reqUsername)
      return res.status(403).json('You are not allowed to modify');

    await Users.findOneAndDelete({ username: reqUsername });
    res.status(200).json('Deleted');
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getRandomUsers = async (req, res) => {
  const nameQ = req.query.username;
  try {
    let users = [];
    if (nameQ) {
      users = await Users.find({ username: { $regex: nameQ } });
    } else {
      users = await Users.aggregate([{ $sample: { size: 5 } }]);
    }
    const usersToSend = users.map((user) => {
      const { username, profilePic, followers } = user;
      return { username, profilePic, followers };
    });
    res.status(200).json(usersToSend);
  } catch (error) {
    res.status(500).json('errror');
  }
};

export { getAllUsers, getSingleUser, updateUser, deleteUser, getRandomUsers };
