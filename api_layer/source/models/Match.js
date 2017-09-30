const mongoose = require('mongoose');
const errors = require('../utility/error');


const MatchSchema = mongoose.Schema({
    gameToken: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    hostIP: {
        type: String,
        required: true,
    },
    hostPort: {
        type: Number,
        required: true,
    },
});

MatchSchema.statics.findByToken = function (gameToken) {
    return new Promise((resolve, reject) => {
        this.find({ gameToken }).exec()
            .then(match => resolve(match))
            .catch(err => reject(err));
    });
};

MatchSchema.statics.findMatch = function(id) {
    return new Promise((resolve, reject) => {
        this.findById(id).exec()
            .then(match => {
                const code = (match) ? 200 : 404;
                resolve({code, match});
            })
            .catch(err => reject(errors.ERROR_500))
    });
};

MatchSchema.statics.getAll = function () {
    return new Promise(function (resolve, reject) {
        this.find({}).exec()
            .then(matches => resolve(matches))
            .catch(err => reject(err));
    });
};

module.exports = mongoose.model('MatchModel', MatchSchema, 'matches');
