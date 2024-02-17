const mongoose = require('mongoose');
const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError('No existen registros de noticias');
    })
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError('No existen registros de noticias');
      }

      res.send({ data: articles });
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { tag, title, description, date, author, link, image } = req.body;
  Article.create({
    tag,
    title,
    description,
    date,
    author,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      const error = new Error(err.message);
      error.statusCode = 400;
      next(error);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);

  if (isValidObjectId === true) {
    Article.findByIdAndRemove(req.params.id, { owner: req.user._id })
      .orFail(() => {
        throw new NotFoundError('No existe registro de la noticia');
      })
      .then((article) => {
        if (!article) {
          throw new NotFoundError('No existe registro de la noticia');
        }
        res.send({ data: article });
      })
      .catch(next);
  } else {
    throw new NotFoundError('No existe registro de noticia');
  }
};
