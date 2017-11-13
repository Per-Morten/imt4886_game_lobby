const mongoose = require('mongoose');
const dbConfig = require('../config/database');

module.exports.connect = (uri) => {
    mongoose.connect(uri);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error: $(err)`);
        process.exit(1);
    });

    require('./user');
};

TO BE REMOVED
