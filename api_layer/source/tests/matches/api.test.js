import test from 'ava';

const request = require('supertest');
const MatchModel = require('../../models/Match');
const db = require('../database');
const mongoose = require('mongoose');

const testMatch1 = {
    gameToken: 'Game 1',
    status: 1,
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
test.serial('Should return a match', async(t) => {
    const retObject = ['gameToken', 'status', 'hostIP', 'hostPort', '_id', '__v'];
    t.plan(retObject.length + 1);

    await request(server)
        .get('/match/' + t.context.matches[0]._id)
        .expect(200)
        .then(response => {
            Object.entries(response.body).forEach(
                ([key, value]) => {
                    if (retObject.indexOf(key) === -1 || value === '') {
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
        .get('/match/' + matches[0]._id)
        .expect(200)
        .catch(err => t.fail(err));

    await request(server)
        .delete('/match/' + matches[0]._id)
        .expect(204)
        .catch(err => t.fail(err));

    await request(server)
        .get('/match/' + matches[0]._id)
        .expect(404)
        .catch(err => t.fail(err));

    await request(server)
        .delete('/match/' + matches[0]._id)
        .expect(404)
        .catch(err => t.fail(err));

    await request(server)
        .get('/match/' + matches[1]._id)
        .expect(200)
        .catch(err => t.fail(err));

    t.pass();
});

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
