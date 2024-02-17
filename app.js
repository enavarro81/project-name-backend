const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// conectar con el servidor MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/newsdb');

const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middelware/auth');

const { requestLogger, errorLogger } = require('./middelware/logger');

// detecta el puerto 3000
const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // habilitar el logger de solicitud

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().required().min(2).max(30),
      })
      .unknown(true),
  }),
  createUser
);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/articles'));

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});

app.use(errorLogger); // habilitar el logger de errores

app.use(errors());

app.use((err, req, res, next) => {
  // si un error no tiene estado, se muestra 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // comprueba el estado y muestra un mensaje basado en dicho estado
    message:
      statusCode === 500 ? 'Se ha producido un error en el servidor' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`); // eslint-disable-line no-console
});
