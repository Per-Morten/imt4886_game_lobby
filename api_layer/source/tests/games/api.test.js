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

