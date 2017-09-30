const MatchModel = require('../models/Match');

module.exports = (api) => {
    api.route('/')
        .get((req, res) => {
            MatchModel.getAll()
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });

    /**
     * @api {get} /matches/:gameToken Request matches with given gameToken
     * @apiName GetMatches
     * @apiGroup Matches
     * @apiDescription
     * Returns a list of all matches that contain the provided gameToken.
     * This list is empty if no matches were found.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     */
    api.route('/matches/:gameToken')
         .get((req, res) => {
            MatchModel.findByToken(req.params.gameToken)
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });
};
