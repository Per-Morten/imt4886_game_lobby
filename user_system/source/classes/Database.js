const mongoose = require('mongoose');
const debug = require('debug');
const dbConfig = require('../config/database');

class Database {
    constructor() {
        this.mongoose = mongoose;
        this.mongoose.Promise = global.Promise;

        this.mongoose.connection.on('connected', this.onConnect);
        this.mongoose.connection.on('disconnect', this.onDisconnect);
        this.mongoose.connection.on('error', this.onError);
    }

    connect() {
        this.mongoose.connect(dbConfig.uri, dbConfig.options);
        return this.mongoose;
    }

    onConnect() {
        debug('Kjapp:server')(`Mongoose connected with uri ${dbConfig.uri}`);
    }

    onDisconnect() {
        console.log('Server disconnected');
    }

    onError() {
        console.log('Error');
    }
}

module.exports = new Database();
