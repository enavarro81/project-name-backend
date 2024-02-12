const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const articleSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
    link: {
      type: String,
      require: true,
      validate: {
        validator: (v) => isURL(v),
        message: 'Formato de URL de noticia incorrecto',
      },
    },
    image: {
      type: String,
      require: true,
      validate: {
        validator: (v) => isURL(v),
        message: 'Formato de URL de imagen incorrecto',
      },
    },
    owner: { type: mongoose.Types.ObjectId, ref: 'user', require: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('articles', articleSchema);
