const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const UserController = require('./controllers/UserController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');
const LoginController = require('./controllers/LoginController');

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post('/login', LoginController.store);

routes.get('/users', UserController.index);
routes.post('/users', upload.single('avatar'), UserController.store);

routes.post('/users/:targetId/like', LikeController.store);
routes.post('/users/:targetId/dislike', DislikeController.store);

module.exports = routes;