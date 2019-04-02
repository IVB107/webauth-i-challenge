const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// POST --> /api/register
router.post('/register', (req, res) => {
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
router.post('/login', (req, res) => {
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

// GET --> /api/auth/logout
router.get('/logout', (req, res) => {
  req.session
    ? req.session.destroy(err => {
      err
        ? res.send(err)
        : res.send('See you next time!');
    })
    : res.status(500);
});

module.exports = router;