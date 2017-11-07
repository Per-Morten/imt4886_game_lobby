import test from 'ava';

const request = require('supertest');
const MatchModel = require('../../models/Match');
const db = require('../database');
const mongoose = require('mongoose');
const matchDesc = require('../matches/match_desc');
const GameModel = require('../../models/Game');

const testMatch1 = {
    name: 'Test Match 1',
    gameToken: 'Game 1',
    status: 0,
    hostIP: '127.0.0.0',
    hostPort: 3000,
};

const testMatch2 = {
    name: 'Test Match 2',
    gameToken: 'Game 2',
    status: 0,
    hostIP: '127.0.0.1',
    hostPort: 3000,
};

const testMatch3 = {
    name: 'Test Match 3',
    gameToken: 'Game 1',
    status: 0,
    hostIP: '127.0.0.1',
    hostPort: 3000,
};

const testMatch4 = {
    name: 'Test Match 4',
    gameToken: 'Game 2',
    status: 0,
    hostIP: '127.0.0.1',
    hostPort: 3000,
    maxPlayerCount: 36,
};

const testMatch5 = {
    name: 'Test Match 5',
    gameToken: 'Game 2',
    status: 0,
    hostIP: '127.0.0.1',
    hostPort: 3000,
    maxPlayerCount: 36,
};

const testMatch6 = {
    name: 'Test Match 6',
    gameToken: 'Game 2',
    status: 0,
    hostIP: '127.0.0.1',
    hostPort: 3000,
    maxPlayerCount: 2,
    playerCount: 2,
};

const testGame1 = {
    name: 'Game1',
    valid: true,
};

const testGame2 = {
    name: 'Game2',
    valid: true,
};

const invalidGame = {
    name: 'InvalidGame',
};

const invalidId = '111111111111111111111111';

test.cb.before((t) => {
    db('matchreport-api-test')
        .then(() => t.end())
        .catch(err => t.fail(err));
});

test.cb.after((t) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close();
        t.end();
    });
});

test.cb.after((t) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close();
        t.end();
    });
});

test.cb.beforeEach((t) => {
    MatchModel.remove({}, () => {
        let promises1 = [
            GameModel.create(Object.assign({}, testGame1)),
            GameModel.create(Object.assign({}, testGame2)),
            GameModel.create(Object.assign({}, invalidGame)),
        ];
        Promise.all(promises1)
            .then(games => {
                if (games[0] && games[1] && games[2]) {
                    testMatch1.gameToken = games[0]._id;
                    testMatch2.gameToken = games[1]._id;
                    testMatch3.gameToken = games[0]._id;
                    testMatch4.gameToken = games[1]._id;
                    testMatch5.gameToken = games[1]._id;
                    testMatch6.gameToken = games[1]._id;

                    t.context.games = games;
                    t.context.invalidGame = games[2];
                }
                let promises2 = [
                    MatchModel.create(Object.assign({}, testMatch1)),
                    MatchModel.create(Object.assign({}, testMatch2)),
                    MatchModel.create(Object.assign({}, testMatch3)),
                    MatchModel.create(Object.assign({}, testMatch4)),
                    MatchModel.create(Object.assign({}, testMatch5)),
                    MatchModel.create(Object.assign({}, testMatch6)),

                ];

                Promise.all(promises2)
                    .then(matches => {
                        if (matches[0] && matches[1] && matches[2] && matches[3]) {
                            t.context.matches = matches;
                            t.end();
                        }
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err))
    });
});

const server = require('../../classes/App');


///////////////////////////////////////////////////////////
/// Post Match Reports Tests
///////////////////////////////////////////////////////////
test.serial('Match report tests for POST, GET, DELETE and average values', async(t) => {
    t.plan(5);
    let deleteTestID = 0;

    const testReport1 = {
        matchID: t.context.matches[0]._id,
        gameToken: t.context.games[0]._id,
        data: {
            duration: 1500,
            score: 10000000,
        },
    };

    const testReport2 = {
        matchID: t.context.matches[2]._id,
        gameToken: t.context.games[0]._id,
        data: {
            duration: 200,
            score: 500,
        },
    };

    await request(server)
        .post('/match_report/')
        .send(testReport1)
        .expect(200)
        .then(response => {
            deleteTestID = response.body._id;
            t.pass();
        })
        .catch(err => t.fail(err));

    await request(server)
        .post('/match_report/')
        .send(testReport2)
        .expect(200)
        .then(response => t.pass())
        .catch(err => t.fail(err));

    await request(server)
        .get('/match_reports/')
        .send({ gameToken: testReport1.gameToken})
        .expect(200)
        .then(response => {
            if(response.body.length != 2) {
                t.fail(`Returned ${response.body.length} reports when 2 should have been returned`);
            }
        })
        .catch(err => t.fail(err));

    const expectedAverage = (testReport1.data.duration + testReport2.data.duration) / 2;
    await request(server)
        .get('/match_reports/average/')
        .send({ gameToken: testReport1.gameToken, fieldName: 'duration' })
        .expect(200)
        .then(response => {
            if(response.body == expectedAverage) {
                t.pass();
            } else {
                t.fail(`Received ${response.body} when ${expectedAverage} was expected`);
            }
        })
        .catch(err => t.fail(err));

    await request(server)
        .delete('/match_report/')
        .send({ id: deleteTestID })
        .expect(204)
        .then(response => t.pass())
        .catch(err => t.fail(err));

    t.pass();
});
