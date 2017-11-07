const GameModel = require('../models/Game');

module.exports = (api) => {
    /**
     * @api {post} /game/ Create a game with the specified parameters
     * @apiName CreateGame
     * @apiGroup Game
     * @apiDescription
     *  Creates a game with the given JSON object.
     *  Returns 200 on success together with the newly created game.
     *
     * @apiParam {String} name The name of the game, must be unique.
     * @apiParam {String} description A description of the game.
     *
     * @apiSuccess (200) _id The unique identifier of the game. This is also the gameToken.
     * @apiSuccess (200) __v The version of the game in the database.
     * @apiSuccess (200) name The name of the game.
     * @apiSuccess (200) valid Flag stating if the game is valid or not.
     * @apiSuccess (200) description A description of the game
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "59c7f0c9b0a0932165c058b6",
     *       "__v": 0,
     *       "name": "Game 1",
     *       "valid": false,
     *       "description": "A fun new game"
     *     }
     *
     * @apiError (400) BadRequest Could not create the game because of some invalid parameters.
     *                 For example sending in a name that already exists.
     */
    api.route('/game/')
       .post((req, res) => {
            GameModel.createGame(req.body)
            .then(out => res.status(out.code).json(out.game))
            .catch(err => res.status(err.code).json(err));
       });
}
