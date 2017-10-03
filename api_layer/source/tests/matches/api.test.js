import test from 'ava';

const request = require('supertest');
const MatchModel = require('../../models/Match');
const db = require('../database');
const mongoose = require('mongoose');
const matchDesc = require('./match_desc');

const testMatch1 = {
    gameToken: 'Game 1',
    status: 0,
    hostIP: '127.0.0.0',
    hostPort: 3000,
};

const testMatch2 = {
    gameToken: 'Game 2',
    status: 0,
    hostIP: '127.0.0.1',
    hostPort: 3000,
};

const testMatch3 = {
    gameToken: 'Game 1',
    status: 0,
    hostIP: '127.0.0.1',
    hostPort: 3000,
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
        let promises = [
            MatchModel.create(Object.assign({}, testMatch1)),
            MatchModel.create(Object.assign({}, testMatch2)),
            MatchModel.create(Object.assign({}, testMatch3))
        ];
        Promise.all(promises)
            .then(matches => {
                if(matches[0] && matches[1] && matches[2]) {
                    t.context.matches = matches;
                    t.end();
                }
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
        gameToken: 'Game 3',
        status: 0,
        hostIP: '127.0.0.1',
        hostPort: 3000,
    }

    let checkMatch = null;

    await request(server)
        .post('/match/' + JSON.stringify(newMatch))
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
        .put('/match/' + t.context.matches[0]._id + '/' + 1)
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
        .put('/match/' + '111111111111111111111111' + '/' + 1)
        .expect(404)
        .then(response => t.pass())
        .catch(err => t.fail(err));

    t.pass();
});

test.serial('Update playercount', async(t) => {
    await request(server)
        .put('/match/player_count/' + t.context.matches[0]._id + '/' + 2)
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
        .put('/match/player_count/' + invalidId + '/' + 3)
        .expect(404)
        .then(response => t.pass())
        .catch(err => t.fail(err));
})

///////////////////////////////////////////////////////////
/// Multiple Matches Tests
///////////////////////////////////////////////////////////
test.serial('Returning matches with given gameToken: test', async(t) => {
    await request(server)
        .get('/matches/' + t.context.matches[0].gameToken)
        .expect(200)
        .then(response => {
            if(response.body.length != 2) {
                t.fail(`Returned ${response.body.length} matches when 2 matches should have been returned`);
            }
        })
        .catch(err => t.fail(err));

    t.pass();
});
