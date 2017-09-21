const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const serverMiddleware = require('../middleware/server');

const apiRoutes = require('../controllers');

class App {
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    Object.values(serverMiddleware).map(middleware => this.express.use(middleware));
  }

  routes() {
    const router = express.Router();

    apiRoutes(router);

    this.express.use('/', router);
  }
}

module.exports = new App().express;
