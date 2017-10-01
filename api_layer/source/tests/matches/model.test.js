import test from 'ava';

const db = require('../database');
const mongoose = require('mongoose');
const MatchModel = require('../../models/Match');


const match = {
    gameToken: 'Game 1',
    status: 1,
    hostIP: '127.0.0.0',
    hostPort: 3000,
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
    MatchModel.remove({}, () => t.end());
});

test.serial('Create a new match', async (t) => {
    t.plan(2);

    const p = await MatchModel.create(Object.assign({}, match));
    if (p) {
        t.pass();
    } else {
        t.fail('Could not create the match');
    }

    const p2 = await MatchModel.find({ _id: p._id }).exec();
    if (p2) {
        t.pass();
    } else {
        t.fail('Could not find created match');
    }
});

test.serial('Find match by id', async (t) => {
    t.plan(2);

    const p = await MatchModel.create(Object.assign({}, match));
    if (p) {
        t.pass();
    } else {
        t.fail('Could not create the match');
    }

    const p2 = await MatchModel.findById(p._id).exec();
    if (p2) {
        t.pass();
    } else {
        t.fail('Could not find the created match');
    }
});

