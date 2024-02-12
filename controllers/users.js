const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (password !== '') {
    bcrypt
      .hash(password, 10)
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash,
        })
      )
      .then((user) => {
        const respUser = user.toObject();
        delete respUser.password;
        res.send({ data: respUser });
      })
      .catch((err) => {
        const error = new Error(
          err.message.includes('E11000 duplicate key error collection')
            ? `email ${email} already exists`
            : err.message
        );
        error.statusCode = 400;
        next(error);
      });
  } else {
    throw new NotFoundError(
      'user validation failed: password: Path `password` is required.'
    );
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : '041bb30c00a4f00c372baab6c73c4e2a',
        {
          expiresIn: '7d',
        }
      );

      res.send({ token });
    })
    .catch(next);
};
