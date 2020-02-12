const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const routes = require('./routes');

const server = express();

mongoose.connect('mongodb+srv://ricsonl:tindev@cluster0-nxomu.mongodb.net/tindev?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

server.use(cors());
server.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));
server.use(express.json());
server.use(routes);

server.listen(3333);