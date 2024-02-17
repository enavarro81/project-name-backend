const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Se requiere autorización' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production'
        ? JWT_SECRET
        : '041bb30c00a4f00c372baab6c73c4e2a'
    );
  } catch (err) {
    return res.status(401).send({ message: 'Se requiere autorización' });
  }

  req.user = payload;

  return next();
};
