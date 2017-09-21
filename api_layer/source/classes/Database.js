const mongoose = require('mongoose');
const debug = require('debug');
const dbConfig = require('../config/database');

class Database {
  constructor() {
    this.mongoose = mongoose;
    this.mongoose.Promise = global.Promise;

    this.mongoose.connection.on('connected', this.onConnected);
    this.mongoose.connection.on('disconnected', this.onDisconnect);
    this.mongoose.connection.on('error', this.onError);
    this.debug = debug;
  }

  connect() {
    this.mongoose.connect(dbConfig.uri, dbConfig.options);
    return this.mongoose;
  }

  onConnected() {
    this.debug('Kjapp:server')(`Mongoose connected with uri ${dbConfig.uri}`);
  }

  onDisconnect() {
    this.console.log('Server disconnected');
  }

  onError() {
    this.console.log('Error');
  }
}

module.exports = new Database();
