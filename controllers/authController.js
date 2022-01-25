import Users from '../models/Users.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await Users.create({ username, email, password });
    res.status(201).json('Created');
  } catch (error) {
    res.status(500).json({ error });
  }
};

const signInUser = async (req, res) => {
  const { auth, password } = req.body;
  try {
    let user = {};
    if (!validator.isEmail(auth)) {
      user = await Users.findOne({ username: auth });
    } else {
      user = await Users.findOne({ email: auth });
    }
    if (!user) return res.status(404).json('Not Found');
    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(400).json('Incorrect');
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );
    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const checkPassword = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });

    if (!user) return res.status(404).json('Not Found');
    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(400).json({ isMatched: false });
    res.status(200).json({ isMatched: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { registerUser, signInUser, checkPassword };
