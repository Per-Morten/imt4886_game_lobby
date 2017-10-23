import test from 'ava';

const db = require('../database');
const mongoose = require('mongoose');
const MatchModel = require('../../models/Match');
const GameModel = require('../../models/Game');
const MatchReportModel = require('../../models/MatchReport')

const match = {
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

test.cb.before((t) => {
    db('match-model-test')
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
                    match.gameToken = games[0]._id;
                    match2.gameToken = games[1]._id;
                    testReport1.gameToken = games[0]._id;
                    testReport2.gameToken = games[0]._id;
                }
                t.end();
            })
            .catch(err => console.log(err));
    });

    MatchReportModel.remove({});
});

///////////////////////////////////////////////////////////
/// Single Match Tests
///////////////////////////////////////////////////////////
test.serial('Create a new match', async (t) => {
    t.plan(2);

    const p = await MatchModel.createMatch(match);
    if (p.code == 200) {
        t.pass();
    } else {
        t.fail('Could not create the match');
    }

    const p2 = await MatchModel.findMatch(p.match._id);
    if (p2.code == 200) {
        t.pass();
    } else {
        t.fail('Could not find created match');
    }
});

test.serial('Find match by id', async (t) => {
    t.plan(2);

    const p = await MatchModel.createMatch(match);
    if (p.code == 200) {
        t.pass();
    } else {
        t.fail('Could not create the match');
    }

    const p2 = await MatchModel.findMatch(p.match._id);
    if (p2.code == 200) {
        t.pass();
    } else {
        t.fail('Could not find the created match');
    }
});

test.serial('Delete match', async (t) => {
    t.plan(3);
    const m1 = await MatchModel.createMatch(match);
    const m2 = await MatchModel.createMatch(match2);
    if (m1.code == 200 && m2.code == 200) {
        t.pass();
    } else {
        t.fail('Could not create the matches');
    }

    await MatchModel.deleteMatch(m2.match._id);
    const test1 = await MatchModel.findMatch(m2.match._id);
    if (test1.code == 404) {
        t.pass();
    } else {
        t.fail('Did not delete the match');
    }

    const test2 = await MatchModel.findMatch(m1.match._id);
    if (test2.code == 200) {
        t.pass();
    } else {
        t.fail('Deleted to many or wrong match!');
    }
});

test.serial('Update match playerCount', async(t) => {
    t.plan(3);

    const m1 = await MatchModel.createMatch(match);
    if (m1.code == 200) {
        t.pass();
    } else {
        t.fail('Could not create the matches');
    }

    const res = await MatchModel.updatePlayerCount(m1.match._id, 2);
    const m2 = await MatchModel.findMatch(m1.match._id);
    if (res.code == 204 && m2.code == 200 && m2.match.playerCount == 2)
        t.pass();
    else
        t.fail('Coult not update playerCount');

    const res2 = await MatchModel.updatePlayerCount(m1.match._id, -2);
    const m3 = await MatchModel.findMatch(m1.match._id);
    if (res2.code == 400 && m3.code == 200 && m3.match.playerCount == 2)
        t.pass();
    else
        t.fail('Can set negative playerCount');

});

///////////////////////////////////////////////////////////
/// Multiple Matches Tests
///////////////////////////////////////////////////////////
test.serial('Find matches with gameToken', async (t) => {
    t.plan(2);

    const m1 = await MatchModel.createMatch(match);
    const m2 = await MatchModel.createMatch(match2);

    if(m1.code == 200 && m2.code == 200) {
        t.pass();
    } else {
        t.fail('Could not create the matches');
    }

    const test1 = await MatchModel.findByToken(m1.match.gameToken);
    if(test1) {
        t.pass();
    } else {
        t.fail('Did not find matches with given gameToken');
    }
});

test.serial('Find in session matches with gameToken', async (t) => {
    t.plan(2);

    const m1 = await MatchModel.createMatch(match);
    await MatchModel.updateStatus(m1.match._id, 1);
    const m2 = await MatchModel.createMatch(match2);

    if(m1.code == 200 && m2.code == 200) {
        t.pass();
    } else {
        t.fail('Could not create the matches');
    }

    const test1 = await MatchModel.findByTokenInSession(m1.match.gameToken);
    if(test1.length === 1) {
        t.pass();
    } else {
        t.fail('Found 2 matches where only 1 is in session');
    }
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
