const debug = require('debug');
const Server = require('./source/classes/Server');
const Database = require('./source/classes/Database');

debug('Kjapp:server')('starting')

const port = Server.normalizePort(process.env.PORT || 3000);

Server.start(port);
