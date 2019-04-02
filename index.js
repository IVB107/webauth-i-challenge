const server = require('./api/server.js');

const port = 4000;

server.listen(port, () => {
  console.log(`*** Good stuff over on Port ${port} ***`);
});