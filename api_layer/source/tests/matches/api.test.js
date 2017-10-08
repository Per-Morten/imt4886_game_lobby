import test from 'ava';

const request = require('supertest');
const MatchModel = require('../../models/Match');
const db = require('../database');
const mongoose = require('mongoose');
const matchDesc = require('./match_desc');
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
    db('match-api-test')
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
                    t.context.games = games;
                    t.context.invalidGame = games[2];
                }
                let promises2 = [
                    MatchModel.create(Object.assign({}, testMatch1)),
                    MatchModel.create(Object.assign({}, testMatch2)),
                    MatchModel.create(Object.assign({}, testMatch3)),
                ];

                Promise.all(promises2)
                    .then(matches => {
                        if (matches[0] && matches[1] && matches[2]) {
                            t.context.matches = matches;
                            t.end();
                        }
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err))
    });
});

const server = require('../../classes/App');

///////////////////////////////////////////////////////////
/// Single Match Tests
///////////////////////////////////////////////////////////
test.serial('Should create a match', async(t) => {
    t.plan(matchDesc.length + 2);

    const newMatch = {
        gameToken: t.context.games[0]._id,
        name: 'Test Match',
        status: 0,
        hostIP: '127.0.0.1',
        hostPort: 3000,
    }

    let checkMatch = null;
    await request(server)
        .post('/match/')
        .send(newMatch)
        .expect(200)
        .then(response => {
            Object.entries(response.body).forEach(
                ([key, value]) => {
                    if (matchDesc.indexOf(key) === -1 || value === '') {
                        t.fail(`Match returned invalid object name ${key} value ${value}`);
                    } else {
                        t.pass();
                    }
                }
            )
            checkMatch = response.body;
        })
        .catch(err => t.fail(err));

    await request(server)
        .get('/match/')
        .send({id: checkMatch._id})
        .expect(200)
        .then(res => {
            if (res._id == checkMatch._id)
                t.pass();
            else
                t.pass(`Invalid value returned for created object. Should been ${checkMatch._id}, was ${res._id}`);
        })
        .catch(err => t.fail(err));

    t.pass();
})

test.serial('Should return a match', async(t) => {
    t.plan(matchDesc.length + 1);

    await request(server)
        .get('/match/')
        .send({id: t.context.matches[0]._id})
        .expect(200)
        .then(response => {
            Object.entries(response.body).forEach(
                ([key, value]) => {
                    if (matchDesc.indexOf(key) === -1 || value === '') {
                        t.fail(`Match returned invalid object name ${key} value ${value}`);
                    } else {
                        t.pass();
                    }
                }
            )
        })
        .catch(err => t.fail(err));

    t.pass();
});

test.serial('Delete a match', async(t) => {
    let matches = t.context.matches;

    await request(server)
        .get('/match/')
        .send({id: matches[0]._id})
        .expect(200)
        .catch(err => t.fail(err));

    await request(server)
        .delete('/match/')
        .send({id: matches[0]._id})
        .expect(204)
        .catch(err => t.fail(err));

    await request(server)
        .get('/match/')
        .send({id: matches[0]._id})
        .expect(404)
        .catch(err => t.fail(err));

    await request(server)
        .delete('/match/')
        .send({id: matches[0]._id})
        .expect(404)
        .catch(err => t.fail(err));

    await request(server)
        .get('/match/')
        .send({id: matches[1]._id})
        .expect(200)
        .catch(err => t.fail(err));

    t.pass();
});

test.serial('Should be able to start match', async(t) => {
    t.plan(3);

    await request(server)
        .put('/match/status')
        .send({id: t.context.matches[0]._id, status: 1})
        .expect(204)
        .catch(err => t.fail(err));

    await request(server)
        .get('/match/')
        .send({id: t.context.matches[0]._id})
        .expect(200)
        .then(response => {
            if (response.body.status == 1)
                t.pass();
            else
                t.fail(`Match no updated, status: ${response.status}`);
        })
        .catch(err => t.fail(err));

    await request(server)
        .put('/match/status')
        .send({id: invalidId, status: 1})
        .expect(404)
        .then(response => t.pass())
        .catch(err => t.fail(err));

    t.pass();
});

test.serial('Update playercount', async(t) => {
    await request(server)
        .put('/match/player_count/')
        .send({id: t.context.matches[0]._id, playerCount: 2})
        .expect(204)
        .catch(err => t.fail(err));

    await request(server)
        .get('/match/')
        .send({id: t.context.matches[0]._id})
        .expect(200)
        .then(response => {
            if (response.body.playerCount == 2)
                t.pass();
            else
                t.fail(`Match has invalid playerCount, should be: 2, is: ${response.body.playerCount}`);
        })
        .catch(err => t.fail(err));

    await request(server)
        .put('/match/player_count/')
        .send({id: invalidId, playerCount: 3})
        .expect(404)
        .then(response => t.pass())
        .catch(err => t.fail(err));
})

test.serial('Cannot create match without valid token', async(t) => {
    const newMatch = {
      gameToken: t.context.invalidGame._id,
      status: 0,
      hostIP: '127.0.0.1',
      hostPort: 3000,
  }

  await request(server)
      .post('/match/')
      .send(newMatch)
      .expect(403)
      .then(response => t.pass())
      .catch(err => t.fail(err));

});

///////////////////////////////////////////////////////////
/// Multiple Matches Tests
///////////////////////////////////////////////////////////
test.serial('Returning matches with given gameToken: test', async(t) => {
    await request(server)
        .get('/matches/')
        .send({gameToken: t.context.matches[0].gameToken})
        .expect(200)
        .then(response => {
            if(response.body.length != 2) {
                t.fail(`Returned ${response.body.length} matches when 2 matches should have been returned`);
            }
        })
        .catch(err => t.fail(err));

    t.pass();
});

test.serial('Returning matches with given gameToken: test that are in session', async(t) => {
    t.plan(1);

    await request(server)
        .put('/match/status/')
        .send({id: t.context.matches[0]._id, status: 1})
        .expect(204)
        .catch(err => t.fail(err));

    await request(server)
        .get('/matches/in_session/')
        .send({gameToken: t.context.matches[0].gameToken})
        .expect(200)
        .then(response => {
            if(response.body.length != 1) {
                t.fail(`Returned ${response.body.length} matches when 1 match should have been returned`);
            }
        })
        .catch(err => t.fail(err));

    t.pass();
});
