const express = require('express');
const UserController = require('./controllers/UserController');
const LikeController = require('./controllers/LikeController');

const routes = express.Router();

routes.post('/users', UserController.store);
routes.post('/users/:targetId/like', LikeController.store);

module.exports = routes;