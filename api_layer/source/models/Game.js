const mongoose = require('mongoose');
const errors = require('../utility/error');

const GameSchema = mongoose.Schema({
    name: {
        // Must be unique, but unique:true means something else
        // Se we will enforce it ourselves
        type: String,
        required: true,
    },
    valid: {
        type: Boolean,
        required: true,
        default: false,
    },
    description: {
        type: String,
        required: true,
        default: ' ',
    },
});

GameSchema.statics.isValid = async function(id) {
    const game = await this.findById(id);
    return (game && game.valid);
};

GameSchema.statics.nameAvailable = async function(name) {
    let game = await this.find({name: name});
    return (game.length) == 0;
};

GameSchema.statics.createGame = async function(game) {
    try {
        if (!await this.nameAvailable(game.name)) {
            return {code: 400};
        }

        let tmp = {
            name: game.name,
            description: encodeURIComponent(game.description),
        };

        let out = await this.create(Object.assign({}, tmp));
        return {code: 200, game: out};
    } catch(err) {
        throw errors.ERROR_500;
    }
};

GameSchema.statics.findGame = async function(id) {
    try {
        let res = await this.findById(id);
        if (!res) {
            return {code: 404};
        }

        return {code: 200, game: res};
    } catch(err) {
        throw errors.ERROR_500;
    }
}


module.exports = mongoose.model('GameModel', GameSchema, 'games');
