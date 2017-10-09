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
});

GameSchema.statics.isValid = async function(id) {
    const game = await this.findById(id);
    return (game && game.valid);
};

GameSchema.statics.nameAvailable = async function(name) {
    let game = await this.find({name: name});
    return (game.length) == 0;
};

GameSchema.statics.createGame = async function(name) {
    try {
        if (!await this.nameAvailable(name)) {
            return {code: 400};
        }
        let game = await this.create({name: name});
        return {code: 200, game: game};
    } catch(err) {
        throw errors.ERROR_500;
    }
};

module.exports = mongoose.model('GameModel', GameSchema, 'games');
