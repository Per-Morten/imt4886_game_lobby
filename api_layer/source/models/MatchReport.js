const mongoose = require('mongoose');
const errors = require('../utility/error');
const GameModel = require('./Game');

const MatchReportSchema = mongoose.Schema({
    matchID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    gameToken: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

MatchReportSchema.statics.createReport = async function(reportInfo) {
    try {
        if (!await GameModel.isValid(reportInfo.gameToken)) {
            return {code: 403};
        }

        let newReport = {
            matchID: reportInfo.matchID,
            gameToken: reportInfo.gameToken,
            data: reportInfo.data,
        };

        let report = await this.create(Object.assign({}, newReport));

        return {code: 200, report: report};
    } catch (err) {
        throw errors.ERROR_500;
    }
};

MatchReportSchema.statics.getReportsWithToken = async function(gameToken) {
    try {
        let result = await GameModel.findById({_id: gameToken});
        if(!result) {
            return {code: 404};
        }

        let reports = await this.find({gameToken: gameToken})
                                .exec();

        if(reports.length > 0) {
            return {code: 200, reports: reports};
        } else {
            return {code: 404};
        }
    } catch (err) {
        throw errors.ERROR_500;
    }
};

// Assumes that the given field exists within data
MatchReportSchema.statics.getAverage = async function(gameToken, fieldName) {
    try {
        let result = await GameModel.findById({_id: gameToken});
        if(!result) {
            return {code: 404};
        }

        let reports = await this.find({ gameToken: gameToken })
                                .exec();

        if(reports.length > 0 && reports[0].data[fieldName] != null) {
            let sum = 0;
            reports.forEach(function(element) {
                sum += element.data[fieldName];
            });
            return {code: 200, average: sum / reports.length};
        } else {
            return {code: 404};
        }
    } catch (err) {
        throw errors.ERROR_500;
    }
};

// Assumes that the given field exists within data
MatchReportSchema.statics.getMedian = async function(gameToken, fieldName) {
    try {
        let result = await GameModel.findById({_id: gameToken});
        if(!result) {
            return {code: 404};
        }

        let reports = await this.find({ gameToken: gameToken })
                                .exec();

        if(reports.length > 0 && reports[0].data[fieldName] != null) {
            reports.sort(function(a, b) { return (a.data[fieldName] > b.data[fieldName]); });
            let half = Math.floor(reports.length / 2);

            if(reports.length % 2 != 0) {
                return {code: 200, median: reports[half].data[fieldName]};
            } else {
                return {code: 200, median: (reports[half-1].data[fieldName] + reports[half].data[fieldName]) / 2};
            }
        } else {
            return {code: 404};
        }
    } catch (err) {
        throw errors.ERROR_500;
    }
};

MatchReportSchema.statics.deleteReport = function(id) {
    return new Promise((resolve, reject) => {
        this.findByIdAndRemove(id).exec()
            .then((report) => {
                const code = (report) ? 204 : 404;
                resolve({code});
            })
            .catch(err => reject(errors.ERROR_500))
    });
};

module.exports = mongoose.model('MatchReportModel', MatchReportSchema, 'match_reports');
