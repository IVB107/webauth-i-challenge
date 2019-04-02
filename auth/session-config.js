const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const configuredKnex = require('../data/dbConfig.js');

module.exports = {
  name: 'ChicanoBatman',
  secret: 'Friendship is a small boat in a storm',
  cookie: {
    maxAge: 1000 * 60 * 15, // expiration in miliseconds
    secure: false, // use cookie over https only
    httpOnly: true, // JS is denied access to the cookie on the client (if set to 'true')
  },
  resave: false, // avoids re-creating unchanged sessions
  saveUninitialized: false, // GDPR compliance
  store: new KnexSessionStore({
    knex: configuredKnex,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true, // creates table (if none exists)
    clearInterval: 1000 * 60 * 30 // delete expired sessions
  })
}