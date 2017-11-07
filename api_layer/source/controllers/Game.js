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

    /**
     * @api {get} /game/ Get game with a specific id
     * @apiName GetGame
     * @apiGroup Game
     * @apiDescription
     *  Gets the game with the specified id.
     *  Returns 200 on success with the object,
     *  404 if the game with requested id couldn't be found.
     *
     * @apiParam {Id} id The unique id of the game.
     * @apiSuccess (200) _id The unique identifier of the game.
     * @apiSuccess (200) __v The version of the game in the database.
     * @apiSuccess (200) name The name of the game.
     * @apiSuccess (200) valid Flag stating if the game is valid or not.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "59c7f0c9b0a0932165c058b6",
     *       "__v": 0,
     *       "name": "Game 1",
     *       "valid": false,
     *       "description": "A fun game"
     *     }
     *
     * @apiError (404) GameNotFound The supplied ID was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/game/:id')
       .get((req, res) => {
            GameModel.findGame(req.params.id)
            .then(out => res.status(out.code).json(out.game))
            .catch(err => res.status(err.code).json(err));
       });

    /**
     * @api {delete} /game/ Delete the specified game
     * @apiName DeleteGame
     * @apiGroup Game
     * @apiDescription
     *  Deletes the game with the requested id.
     *  Returns 204 on success,
     *  404 if the game with requested id couldn't be found.
     *
     * @apiParam {Id} id The unique ID of the game.
     *
     * @apiSuccess (204) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 OK
     *     {}
     *
     * @apiError (404) GameNotFound The supplied ID was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
     api.route('/game/')
        .delete((req, res) => {
            GameModel.deleteGame(req.body.id)
            .then(out => res.status(out.code).send())
            .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {put} /game/ Update the specified game
     * @apiName UpdateGame
     * @apiGroup Game
     * @apiDescription
     *   Updates the game that is specified with the new value.
     *   Returns 204 on success.
     *   404 if the game with requested ID couldn't be found.
     *   400 if validation fails, for example if name is not available.
     *
     * @apiParam {Id} id the unique ID of the game.
     * @apiParam {String} [name] The new name of the game
     * @apiParam {Boolean} [valid] Set the valid value of the game
     * @apiParam {String} [description] A description of the game.
     *
     * @apiSuccess (204) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 OK
     *     {}
     *
     * @apiError (404) GameNotFound The supplied ID was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/game/')
        .put((req, res) => {
            GameModel.updateGame(req.body)
            .then(out => res.status(out.code).send())
            .catch(err => res.status(err.code).json(err));
        });
}
