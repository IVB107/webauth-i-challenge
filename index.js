const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

// --- CRUDs ---

// GET
server.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

// POST --> /api/register
server.post('/api/register', (req, res) => {
  let user = req.body;

  user.password = bcrypt.hashSync(user.password, 10);

  Users.add(user)
    .then(saved => {
      res.status(200).json(saved);
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

// POST --> /api/login
server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(user.password, password)) {
        res.status(200).json({ message: `Welcome back, ${user}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

// Grant access to endpoint ONLY to
// users who provide the right creds in the header

const restricted = (req, res, next) => {
  const { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        user && bcrypt.compareSync(password, user.password)
          ? next()
          : res.status(401).json({ message: "Access denied, fool!" });
      })
      .catch(err => {
        res.status(500).json(err);
      })
  } else {
    res.status(401).json({ message: "Invalid Credentials." });
  }
}

const only = username => {
  return (req, res, next) => {
    if (req.headers.username === username) {
      next();
    } else {
      res.status(403).json({ "Invalid User." })
    }
  }
}

// GET --> /api/users
server.get('/api/users', restricted, only('ashleigh'), (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.json(err);
    })
})



const port = 4000;

server.listen(port, () => {
  console.log(`*** Good stuff over on Port ${port} ***`);
});