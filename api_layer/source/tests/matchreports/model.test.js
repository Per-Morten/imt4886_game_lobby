import test from 'ava';

const db = require('../database');
const mongoose = require('mongoose');
const MatchModel = require('../../models/Match');
const GameModel = require('../../models/Game');
const MatchReportModel = require('../../models/MatchReport')

const match1 = {
    name: 'Test Match 1',
    gameToken: 'Game 1',
    status: 1,
    hostIP: '127.0.0.0',
    hostPort: 3000,
};

const match2 = {
    name: 'Test Match 2',
    gameToken: 'Game 1',
    status: 0,
    hostIP: '127.0.0.1',
    hostPort: 3000,
};

const match3 = {
    name: 'Test Match 3',
    gameToken: 'Game 1',
    status: 0,
    hostIP: '127.0.0.1',
    hostPort: 3000,
};

const testGame1 = {
    name: 'game1',
    valid: true,
};

const testGame2 = {
    name: 'game2',
    valid: true,
};

const testReport1 = {
    matchID: '09mwuxcenwqiucnapsdfuhc',
    gameToken: 'Game 1',
    data: {
        duration: 1500,
        score: 10000000,
    },
};

const testReport2 = {
    matchID: 'p9dyfp9aweuns0weucnr0weu',
    gameToken: 'Game 1',
    data: {
        duration: 200,
        score: 500,
    },
};

const testReport3 = {
    matchID: 'asdknaknalskd',
    gameToken: 'Game 1',
    data: {
        duration: 50,
        score: 12516,
    },
};

test.cb.before((t) => {
    db('matchreport-model-test')
        .then(() => t.end())
        .catch(err => t.fail(err));
});

test.cb.after((t) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close();
        t.end();
    });
});

test.cb.beforeEach((t) => {
    MatchModel.remove({}, () => {
        let promises = [
            GameModel.create(Object.assign({}, testGame1)),
            GameModel.create(Object.assign({}, testGame2))
        ];
        Promise.all(promises)
            .then(games => {
                if (games[0] && games[1]) {
                    match1.gameToken = games[0]._id;
                    match2.gameToken = games[1]._id;
                    match3.gameToken = games[0]._id;

                    testReport1.gameToken = games[0]._id;
                    testReport2.gameToken = games[0]._id;
                    testReport3.gameToken = games[0]._id;
                }
                let promises2 = [
                    MatchModel.create(Object.assign({}, match1)),
                    MatchModel.create(Object.assign({}, match2)),
                    MatchModel.create(Object.assign({}, match3)),
                ];

                Promise.all(promises2)
                    .then(matches => {
                        if (matches[0] && matches[1] && matches[2]) {
                            testReport1.matchID = matches[0]._id;
                            testReport2.matchID = matches[1]._id;
                            testReport3.matchID = matches[2]._id;
                            t.end();
                        }
                    }).catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    });

    MatchReportModel.remove({});
});

///////////////////////////////////////////////////////////
/// Post Match Reports Tests
///////////////////////////////////////////////////////////
test.serial('Add match report to database', async (t) => {
    t.plan(1);

    const report = await MatchReportModel.createReport(testReport1);

    if(report.code == 200) {
        t.pass();
    } else {
        t.fail('Could not add match report to database');
    }
});

test.serial('Get match report from database', async (t) => {
    t.plan(2);

    const report = await MatchReportModel.createReport(testReport1);
    if(report.code == 200) {
        t.pass()
    } else {
        t.fail('Could not create end of match report');
    }

    const test1 = await MatchReportModel.getReportsWithToken(testReport1.gameToken);
    if(test1.code == 200 && test1.reports.length == 1) {
        t.pass();
    } else {
        t.fail('Could not get match report from the database');
    }
});

test.serial('Get average duration and score from the database', async (t) => {
    t.plan(3);

    const report1 = await MatchReportModel.createReport(testReport1);
    const report2 = await MatchReportModel.createReport(testReport2);
    if(report1.code == 200 && report2.code == 200) {
        t.pass();
    } else {
        t.fail('could not create end of match reports');
    }

    const expectedAverageDuration = (testReport1.data.duration + testReport2.data.duration) / 2;
    const expectedAverageScore = (testReport1.data.score + testReport2.data.score) / 2;
    const test1 = await MatchReportModel.getAverage(testReport1.gameToken, 'duration');
    const test2 = await MatchReportModel.getAverage(testReport2.gameToken, 'score');

    if(test1.code == 200 && test1.average == expectedAverageDuration) {
        t.pass();
    } else {
        t.fail(`Received ${test1.average} when ${expectedAverageDuration} is expected`);
    }

    if(test2.code == 200 && test2.average == expectedAverageScore) {
        t.pass();
    } else {
        t.fail(`Received ${test2.average} when ${expectedAverageScore} is expected`);
    }
});


test.serial('Get median duration from the database', async (t) => {
    t.plan(2);

    const report1 = await MatchReportModel.createReport(testReport1);
    const report2 = await MatchReportModel.createReport(testReport2);
    const report3 = await MatchReportModel.createReport(testReport3);

    if(report1.code == 200 && report2.code == 200 && report3.code) {
        t.pass();
    } else {
        t.fail('could not create end of match reports');
    }

    const expectedMedianDuration = 200;
    const test1 = await MatchReportModel.getMedian(testReport2.gameToken, 'duration');
    if(test1.code == 200 && test1.median == expectedMedianDuration) {
        t.pass();
    } else {
        t.fail(`Received ${test1.median} when ${expectedMedianDuration} is expected`);
    }
});

test.serial('Deleting report from database', async (t) => {
    t.plan(2);

    const report1 = await MatchReportModel.createReport(testReport1);
    if(report1.code == 200) {
        t.pass();
    } else {
        t.fail('Could not create end of match reports');
    }

    const test1 = await MatchReportModel.deleteReport(report1.report._id);
    if(test1.code == 204) {
        t.pass();
    } else {
        t.fail('Could not delete end of match report');
    }
});
