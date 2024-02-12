const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const {
  createArticle,
  getArticles,
  deleteArticle,
} = require('../controllers/articles');

const validateUrl = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

router.get('/articles', getArticles);

router.post(
  '/articles',
  celebrate({
    body: Joi.object().keys({
      tag: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.string().required(),
      author: Joi.string().required(),
      link: Joi.string().required().custom(validateUrl),
      image: Joi.string().required().custom(validateUrl),
    }),
  }),
  createArticle
);

router.delete(
  '/articles/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  deleteArticle
);

module.exports = router;
