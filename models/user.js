const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/not-found-err');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      select: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      select: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Formato de correo electrónico incorrecto',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Email o password incorrecto'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new NotFoundError('Email o password incorrecto')
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
