const express = require('express');
const multerConfig = require('./config/multer');
const upload = require('multer')(multerConfig);

const controllers = require('./controllers');

const routes = express.Router();

routes.get('/posts', controllers.PostController.index);
routes.post('/posts', upload.single('image'), controllers.PostController.store);
routes.post('/posts/:id/like', controllers.LikeController.store);

module.exports = routes;
