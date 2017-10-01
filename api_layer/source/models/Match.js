const mongoose = require('mongoose');

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

MatchSchema.statics.getAll = function () {
    return new Promise(function (resolve, reject) {
        this.find({}).exec()
            .then(matches => resolve(matches))
            .catch(err => reject(err));
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
module.exports = mongoose.model('MatchModel', MatchSchema, 'matches');
