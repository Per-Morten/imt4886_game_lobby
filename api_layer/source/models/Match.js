const mongoose = require('mongoose');
const errors = require('../utility/error');
const GameModel = require('./Game');

const MatchSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gameToken: {
        type: mongoose.Schema.Types.ObjectId,
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
    maxPlayerCount: {
        type: Number,
        required: true,

        // Adding this default to deal with getting non-full matches that
        // does not have a maxPlayerCount.
        default: Number.MAX_SAFE_INTEGER,
    }
});

MatchSchema.statics.isValidMatch = function(match) {
    // Check valid ip Address
    const ipCheck = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$/
    if (!ipCheck.test(match.hostIP))
        return false;

    // Check valid port number
    const portCheck = /^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[0-5][0-9]{0,4})$/
    if (!portCheck.test(match.hostPort))
        return false;

    return true;
};

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

MatchSchema.statics.createMatch = async function(matchInfo) {
    try {
        if (!await GameModel.isValid(matchInfo.gameToken)) {
            return {code: 403};
        }

        if (!this.isValidMatch(matchInfo)) {
            return {code: 400};
        }

        let match = await this.create(Object.assign({}, matchInfo));
        return {code: 200, match: match};
    } catch (err) {
        throw errors.ERROR_500;
    }
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
        if (playerCount < 1) {
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

MatchSchema.statics.findByTokenNotFull = async function(gameToken) {
    try {
        let result = await GameModel.findById({_id: gameToken});
        if (!result) {
            return {code: 404};
        }
        let matches = await this.find({gameToken: gameToken})
                                .$where('this.playerCount < this.maxPlayerCount')
                                .exec();

        return {code: 200, matches: matches};
    } catch(err) {
        throw errors.ERROR_500;
    }
}

module.exports = mongoose.model('MatchModel', MatchSchema, 'matches');
