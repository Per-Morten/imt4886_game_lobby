const mongoose = require('mongoose');

const DBconfig = {
    uri: 'mongodb://localhost:27017/',
    options: {
        useMongoClient: true,
    },
};

mongoose.Promise = global.Promise;
mongoose.connection.on('disconnect', () => console.log('Mongoose server disconnected'));

module.exports = dbname => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DBconfig.uri + dbname, DBconfig.options);
        mongoose.connection.on('connected', () => {
            resolve(mongoose);
        });
        mongoose.connection.on('error', (err) => {
            console.log(`Mongoose error ${error}`);
            reject('Not able to connect to the database');
        });
    });
}

