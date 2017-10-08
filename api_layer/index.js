const debug = require('debug');
const Server = require('./source/classes/Server');
const Database = require('./source/classes/Database');

if (!module.parent) {
    Database.connect();
}

debug('Kjapp:server')('starting');

const port = Server.normalizePort(process.env.PORT || 8333);

Server.start(port);

debug('Kjapp:server')(`Started on ${port}`);
