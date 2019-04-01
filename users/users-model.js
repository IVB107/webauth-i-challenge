const db = require('../data/dbConfig.js');

const find = () => {
  return db('users').select('id', 'username', 'password');
};

const findBy = filter => {
  return db('users').where(filter);
};

const findById = id => {
  return db('users')
    .where({ id })
    .first();
};

const add = async user => {
  const [id] = await db('users').insert(user);
  
  return findById(id);
}

module.exports = {
  find,
  findBy,
  findById,
  add
};