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

let gTestMatch1 = null;
let gTestMatch2 = null;

test.cb.beforeEach((t) => {
    MatchModel.remove({}, () => {
        MatchModel.create(Object.assign({}, testMatch1))
        .then(match => {
            if (match) {
                gTestMatch1 = match;
                t.end()
            }
        })
        .catch(err => t.fail(`Failed beforeEach with error ${err}`));
    });
});

const server = require('../../classes/App');

test.serial('Should return a match', async(t) => {
    if (!gTestMatch1)
        t.fail('No new match');

    const retObject = ['gameToken', 'status', 'hostIP', 'hostPort', '_id', '__v'];
    t.plan(retObject.length + 1);

    await request(server)
        .get('/Match/' + gTestMatch1._id)
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
    if (!gTestMatch1)
        t.fail('No new match was created');

    MatchModel.create(Object.assign({}, testMatch2))
    .then(match => {
        if (match) {
            gTestMatch2 = match;
        }
    })
    .catch(err => t.fail(`Failed to create gTestMatch2 with error ${err}`));

    const id = gTestMatch1._id;

    await request(server)
        .delete('/Match/' + gTestMatch1._id)
        .expect(200)
        .then(() => {})
        .catch(err => t.fail(err));

    await request(server)
        .expect(204)
        .catch(err => t.fail(err));
        .expect(404)
        .then(res => {})
        .catch(err => t.fail(err));

    await request(server)
        .delete('/Match/' + gTestMatch1._id)
        .expect(404)
        .then(() => {})
        .catch(err => t.fail(err));

    const retObject = ['gameToken', 'status', 'hostIP', 'hostPort', '_id', '__v'];
    await request(server)
        .get('/Match/' + gTestMatch2._id)
        .expect(200)
        .then(() => {})
        .catch(err => t.fail(err));

    t.pass();
});
