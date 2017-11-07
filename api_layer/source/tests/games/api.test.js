import test from 'ava';

const request = require('supertest');
const db = require('../database');
const mongoose = require('mongoose');
const gameDesc = require('./game_desc');
const GameModel = require('../../models/Game');

test.cb.before((t) => {
    db('game-api-test')
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

const testGame1 = {
    name: 'Test Game 1',
};

test.cb.beforeEach((t) => {
    GameModel.remove({}, () => {
        let promises = [
            GameModel.create(Object.assign({}, testGame1)),
        ];
        Promise.all(promises)
            .then(games => {
                if (games.length > 0) {
                    t.context.games = games;
                    t.end();
                }
            }).catch(err => console.log(err))
    });
});

const server = require('../../classes/App');

///////////////////////////////////////////////////////////
/// Single Game Tests
///////////////////////////////////////////////////////////
test.serial('Should create a game', async(t) => {
    t.plan(gameDesc.length + 1);

    const newGame = {
        name: "Test Game",
    }

    await request(server)
        .post('/game/')
        .send(newGame)
        .expect(200)
        .then(response => {
            Object.entries(response.body).forEach(
                ([key, value]) => {
                    if (gameDesc.indexOf(key) === -1 || value === '') {
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

test.serial('Should get a game by id', async(t) => {
    t.plan(gameDesc.length + 1);

    await request(server)
        .get('/game/' + t.context.games[0]._id)
        .expect(200)
        .then(response => {
            Object.entries(response.body).forEach(
                ([key, value]) => {
                    if (gameDesc.indexOf(key) === -1 || value === '') {
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

///////////////////////////////////////////////////////////
/// Multiple Games Tests
///////////////////////////////////////////////////////////
test.serial('Get All Games', async(t) => {
    await request(server)
        .get('/games/')
        .expect(200)
        .then(response => {
            if (response.body.length != t.context.games.length) {
                t.fail(`Returned ${response.body.length} games then ${t.context.games.length} should have been returned`);
            }
        })
        .catch(err => t.fail(err));

    t.pass();
});
