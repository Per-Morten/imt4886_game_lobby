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
