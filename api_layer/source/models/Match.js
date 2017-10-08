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
    playerCount: {
        type: Number,
        required: true,
        default: 1,
    },
});

MatchSchema.statics.findByToken = function (gameToken) {
    return new Promise((resolve, reject) => {
        this.find({ gameToken }).exec()
            .then(matches => resolve(matches))
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

MatchSchema.statics.deleteMatch = function(id) {
    return new Promise((resolve, reject) => {
        this.findByIdAndRemove(id).exec()
            .then((match) => {
                const code = (match) ? 204 : 404;
                resolve({code});
            })
            .catch(err => reject(errors.ERROR_500))
    });
};

MatchSchema.statics.createMatch = function(matchInfo) {
    return new Promise((resolve, reject) => {
        this.create(Object.assign({}, matchInfo))
            .then(match => {
                resolve({code: 200, match: match});
            })
            .catch(err => reject(errors.ERROR_500));
    });
};

MatchSchema.statics.updateStatus = function(id, status) {
    return new Promise((resolve, reject) => {
            this.findById(id).exec()
                .then(match => {
                    if (match) {
                        match.status = status;
                        match.save((err) => {
                            if (err) {
                                let code = 500;
                                resolve({code});
                            } else {
                                let code = 204;
                                resolve({code});
                            }
                        })
                    } else {
                        let code = 404;
                        resolve({code});
                    }
                })
                .catch(err => reject(errors.ERROR_500));
    });
}

MatchSchema.statics.updatePlayerCount = function(id, playerCount) {
    return new Promise((resolve, reject) => {
        if (playerCount < 1)
        {
            resolve({code: 400});
            return;
        }

        this.findByIdAndUpdate(id, {playerCount: playerCount}).exec()
            .then(match => {
                const code = (match) ? 204 : 404;
                resolve({code});
            })
            .catch(err => reject(errors.ERROR_500));
    });
}

MatchSchema.statics.findByTokenInSession = function (gameToken) {
    return new Promise((resolve, reject) => {
        this.find({ gameToken, status: 1 }).exec()
            .then(matches => resolve(matches))
            .catch(err => reject(err));
    });
};

module.exports = mongoose.model('MatchModel', MatchSchema, 'matches');
