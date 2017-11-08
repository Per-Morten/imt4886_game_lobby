const GameModel = require('../models/Game');

module.exports = (api) => {
    /**
     * @api {get} /games/ Request all games
     * @apiName GetGames
     * @apiGroup Games
     * @apiDescription
     * Returns a JSON array of all games that exists in the database.
     * This array is empty if no games were found.
     *
     * @apiSuccess (200) Success
     */
    api.route('/games/')
         .get((req, res) => {
            GameModel.getAll()
            .then(out => res.status(out.code).json(out.games))
            .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {get} /games/:name Request all with a partial match on name
     * @apiName GetGamesByName
     * @apiGroup Games
     * @apiDescription
     * Returns a JSON array of all games that exists in the database
     * with a name that partially matches with the supplied name..
     *
     * @apiSuccess (200) Success
     *
     * @apiError (404) No games with suplied name was found..
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/games/:name')
       .get((req, res) => {
            GameModel.findByName(req.params.name)
            .then(out => res.status(out.code).json(out.games))
            .catch(err => res.status(err.code).json(err));
       });
}
