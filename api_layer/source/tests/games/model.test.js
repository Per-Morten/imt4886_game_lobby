import test from 'ava';

const db = require('../database');
const mongoose = require('mongoose');
const GameModel = require('../../models/Game');

const testGame1 = {
    name: 'game1',
    valid: false,
};

const testGame2 = {
    name: 'game2',
    valid: true,
};

const newGameName = 'test_game';

test.cb.before((t) => {
    db('game-model-test')
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
    GameModel.remove({}, () => {
        let promises = [
            GameModel.create(Object.assign({}, testGame1)),
            GameModel.create(Object.assign({}, testGame2))
        ];
        Promise.all(promises)
            .then(games => {
                if (games[0] && games[1]) {
                    t.context.games = games;
                    t.end();
                }
            })
            .catch(err => console.log(err));
    });
});

///////////////////////////////////////////////////////////
/// Single Game Tests
///////////////////////////////////////////////////////////
test.serial('Create a new Game', async(t) => {
    t.plan(1);

    const g = await GameModel.createGame(newGameName);
    if (g.code == 200 && g.game.valid == false)
        t.pass();
    else
        t.fail('Could not create new game');
});

test.serial('Reject game with non-unique name', async(t) => {
    t.plan(1);

    const g = await GameModel.createGame(testGame1.name);
    if (g.code === 400) {
        t.pass();
        return;
    }

    t.fail('Managed to create a game with non-unique name');
});
