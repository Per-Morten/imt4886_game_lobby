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

const match2 = {
    gameToken: 'Game 1',
    status: 1,
    hostIP: '127.0.0.1',
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

test.serial('Find matches with gameToken', async (t) => {
    t.plan(2);

    const m1 = await MatchModel.create(Object.assign({}, match));
    const m2 = await MatchModel.create(Object.assign({}, match2));

    if(m1 && m2) {
        t.pass();
    } else {
        t.fail('Could not create the matches');
    }

    const test1 = await MatchModel.findByToken(m1.gameToken);
    if(test1) {
        t.pass();
    } else {
        t.fail('Did not find matches with given gameToken');
    }
});
