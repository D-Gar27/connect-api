import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) return res.status(401).json('Invalid token');
    req.username = decoded;
    next();
  });
};

export { authUser };
