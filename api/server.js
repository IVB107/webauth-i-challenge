const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const sessionConfig = require('../auth/session-config.js');
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

// GET
server.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

module.exports = server;
