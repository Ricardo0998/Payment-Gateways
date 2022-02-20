require('dotenv').config();

// * Start server
const Server = require('./src/controllers/serverCtrl');
const server = new Server();

server.listen();