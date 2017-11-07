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
}
