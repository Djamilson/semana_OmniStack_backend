require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const databaseConfig = require('./config/database');
const server = require('http').Server(this.express);

class App {
  constructor() {
    this.express = express();

    this.middlewares_cors();

    this.io = require('socket.io')(server);

    this.isDev = process.env.NODE_ENV !== 'production';

    this.connectSocket();

    this.database();
    this.middlewares();
    this.routes();
  }

  connectSocket() {
    this.express.use((req, res, next) => {
      req.io = this.io;

      return next();
    });

    /*
    this.io.on('connection', (socket) => {
      console.log('Successfully connected!');
      socket.on('connectRoom', (box) => {
        socket.join(box);
      });
    }); */
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
    this.express.use(morgan('dev'));
    this.express.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads', 'resized')),
    );
  }

  routes() {
    this.express.use(require('./routes'));
  }
}

module.exports = new App().express;
