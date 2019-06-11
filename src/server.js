require('dotenv').config();

const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
const databaseConfig = require('./config/database');

class App {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV !== 'production';

    // this.middlewares();
    // this.views();
    this.database();
    this.routes();
  }

  middlewares() {
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use();
  }

  database() {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
  }

  routes() {
    this.express.use(require('./routes'));
  }
}

module.exports = new App().express;
