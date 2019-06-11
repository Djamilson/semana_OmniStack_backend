require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const databaseConfig = require('./config/database');

class App {
  constructor() {
    this.express = express();

    this.middlewares_cors();

    const server = require('http').Server(this.express);
    this.io = require('socket.io')(server);

    this.isDev = process.env.NODE_ENV !== 'production';

    this.connectSocket();
    this.database();
    this.middlewares();
    this.routes();
  }

  connectSocket() {
    this.io.on('connection', (socket) => {
      socket.on('connectRoom', (box) => {
        socket.join(box);
      });
    });
  }

  database() {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
    });
  }

  middlewares_cors() {
    this.express.use(cors());
  }

  middlewares() {
    this.express.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      req.io = this.io;

      return next();
    });
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true })); // para envia arquivos e fotos
    this.express.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads', 'resizer')),
    );
  }

  routes() {
    this.express.use(require('./routes'));
  }
}

module.exports = new App().express;
