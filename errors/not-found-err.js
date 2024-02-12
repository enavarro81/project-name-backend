class NotFoundError extends Error {
  constructor(message) {
    super(message);

    switch (message) {
      case 'user validation failed: password: Path `password` is required.':
        this.statusCode = 400;
        break;
      case 'Email o password incorrecto':
        this.statusCode = 401;
        break;
      case 'No existen registros de noticias':
        this.statusCode = 404;
        break;
      case 'No existe registro de la noticia':
        this.statusCode = 404;
        break;
      case 'Se requiere autorización':
        this.statusCode = 404;
        break;
      default:
        this.statusCode = 500;
    }
  }
}

module.exports = NotFoundError;
