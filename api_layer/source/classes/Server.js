const express = require('express');
const http = require('http');
const debug = require('debug');
const App = require('./App'); // TODO change name

class Server {
  constructor() {
    this.express = App; // TODO change name
    this.onListening = this.onListening.bind(this);
    this.onError = this.onError.bind(this);
  }

  configure(key, value) {
    this.express.set(key, value);
  }

  start(port) {
    this.port = port;

    this.server = http.createServer(App);
    this.server.on('error', this.onError);
    this.server.on('Listening', this.onListening);

    this.server.listen(this.port);
    return this.server;
  }

  normalizePort(val) {
    let port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
      return val;
    } else if (port >= 0) { // TODO change to relevant range
      return this.port;
    } else {
      return false;
    }
  }

  onListening() {
    const addr = this.server.adress();
    const bind = (typeof this.port === 'string') ? `Pipe ${addr}` : `Port ${addr.port}`
    debug('Kjapp:server')(`Listening on ${bind}`);
  }

  onError(error) {
    if (error.syscall !== 'listen') throw error;
    const bind = (typeof this.port === 'string') ? `Pipe ${this.port}` : `Port ${this.port}`;
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDINUSE':
        console.error(`${bind} is already in use`);
        process.exit();
        break;
      default:
        throw error;
    }
  }
}

module.exports = new Server();
