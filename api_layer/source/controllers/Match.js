const MatchModel = require('../models/Match');
const errors = require('../utility/error');


module.exports = (api) => {
    /**
     * @api {get} /match/:id Get match with a specific id
     * @apiName GetMatch
     * @apiGroup Match
     * @apiDescription
     *  Gets the match with the specified id.
     *  Returns 200 on success with the object,
     *  404 if the match with requested id couldn't be found.
     *
     * @apiParam {Id} id The unique id of the match.
     * @apiSuccess (200) _id The unique identifier of the match.
     * @apiSuccess (200) __v The version of the match in the database.
     * @apiSuccess (200) gameToken The identifier of the game the match belongs to.
     * @apiSuccess (200) status The current status of the game. 0 for waiting, 1 for in session.
     * @apiSuccess (200) hostIP The ip address of the host of the match.
     * @apiSuccess (200) hostPort The port that the match is run on.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "59c7f0c9b0a0932165c058b6"
     *       "__v": 0
     *       "gameToken": "Game 1"
     *       "status": 1
     *       "hostIP": "127.0.0.0",
     *       "hostPort": 3000
     *     }
     *
     * @apiError (404) MatchNotFound The supplied ID was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/match/:id')
       .get((req, res) => {
            const id = req.params.id;
            MatchModel.findMatch(id)
            .then(out => res.status(out.code).json(out.match))
            .catch(err => res.status(err.code).json(err));
       });

    /**
     * @api {delete} /match/:id Delete the specified match
     * @apiName DeleteMatch
     * @apiGroup Match
     * @apiDescription
     *  Deletes the match with the requested id.
     *  Returns 204 on success,
     *  404 if the match with requested id couldn't be found.
     *
     * @apiParam {Id} id The unique ID of the match.
     *
     * @apiSuccess (204) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 OK
     *     {}
     *
     * @apiError (404) MatchNotFound The supplied ID was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/match/:id')
       .delete((req, res) => {
            const id = req.params.id;
            MatchModel.deleteMatch(id)
            .then(out => res.status(out.code).send())
            .catch(err => res.status(err.code).json(err));
       });
}
