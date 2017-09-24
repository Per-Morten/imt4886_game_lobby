const MatchModel = require('../models/Match');

module.exports = (api) => {
    api.route('/')
        .get((req, res) => {
            MatchModel.getAll()
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });

    /**
     * @api {get} /Match/:gameToken Request matches with given gameToken
     * @apiName GetMatches
     * @apiGroup Matches
     *
     * @apiParam {String} gameToken The unique game token of a game.
     *
     */
    api.route('/Matches/:gameToken')
         .get((req, res) => {
            MatchModel.findByToken(req.params.gameToken)
                .then(list=> res.json(list))
                .catch(err => res.json(err));
        });
};
