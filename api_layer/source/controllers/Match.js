const MatchModel = require('../models/Match');
const errors = require('../utility/error');

module.exports = (api) => {
    /**
     * @api {get} /match/ Get match with a specific id
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
     * @apiSuccess (200) playerCount The number of players in the match.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "59c7f0c9b0a0932165c058b6"
     *       "__v": 0
     *       "gameToken": "Game 1"
     *       "status": 1
     *       "hostIP": "127.0.0.0",
     *       "hostPort": 3000,
     *       "playerCount": 1
     *     }
     *
     * @apiError (404) MatchNotFound The supplied ID was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/match/')
       .get((req, res) => {
            const id = req.body.id;
            MatchModel.findMatch(id)
            .then(out => res.status(out.code).json(out.match))
            .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {delete} /match/ Delete the specified match
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
    api.route('/match/')
       .delete((req, res) => {
            const id = req.body.id;
            MatchModel.deleteMatch(id)
            .then(out => res.status(out.code).send())
            .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {post} /match/ Create a match with the specified parameters
     * @apiName CreateMatch
     * @apiGroup Match
     * @apiDescription
     *  Creates a match with the given parameters.
     *  Returns 200 on success together with the newly created match.
     *
     * @apiParam (MatchInfo){String} gameToken The gameToken belonging to this game
     *                                         (given to developers on per game basis).
     * @apiParam (MatchInfo){Number={0..1}} status The current status of the match,
     *                                             0 for waiting, 1 for in game.
     * @apiParam (MatchInfo){String} hostIP The ip address of the machine hosting the match.
     * @apiParam (MatchInfo){Number} hostPort The port which the host is listening on for the match.
     *
     * @apiSuccess (200) _id The unique identifier of the match.
     * @apiSuccess (200) __v The version of the match in the database.
     * @apiSuccess (200) gameToken The identifier of the game the match belongs to.
     * @apiSuccess (200) status The current status of the game. 0 for waiting, 1 for in session.
     * @apiSuccess (200) hostIP The ip address of the host of the match.
     * @apiSuccess (200) hostPort The port that the match is run on.
     * @apiSuccess (200) playerCount The number of players in the match.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "59c7f0c9b0a0932165c058b6"
     *       "__v": 0
     *       "gameToken": "Game 1"
     *       "status": 1
     *       "hostIP": "127.0.0.0",
     *       "hostPort": 3000,
     *       "playerCount": 1
     *     }
     */
    api.route('/match/')
       .post((req, res) => {
            const info = req.body;
            MatchModel.createMatch(info)
            .then(out => res.status(out.code).json(out.match))
            .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {put} /match/status Update status of specified match
     * @apiName UpdateMatchStatus
     * @apiGroup Match
     * @apiDescription
     *   The status of the match with the specified ID is updated
     *   Returns 204 on success,
     *   404 if the match with requested ID couldn't be found.
     *
     * @apiParam {Id} id the unique ID of the match.
     * @apiParam {Number={0..1}} status the current status of the match.
     *                           0 if waiting 1 if in session.
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
    api.route('/match/status')
       .put((req, res) => {
            const id = req.body.id;
            const status = req.body.status;
            MatchModel.updateStatus(id, status)
            .then(out => res.status(out.code).send())
            .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {put} /match/player_count/ Update the player count on a specific match
     * @apiName UpdatePlayerCount
     * @apiGroup Match
     * @apiDescription
     *  Updates the number of players on the specified match.
     *  Returns 204 on success,
     *  404 if the match with requested id couldn't be found.
     *  400 if the request was invalid.
     *
     * @apiParam {Id} id The unique ID of the match.
     * @apiParam {Number={1..inf}} player_count The new number of players.
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
     *
     * @apiError (400) InvalidRequest The supplied playerCount did not adhere to the given limits.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Not Found
     *     {}
     */
    api.route('/match/player_count/')
       .put((req, res) => {
            const id = req.body.id;
            const playerCount = req.body.playerCount;
            MatchModel.updatePlayerCount(id, playerCount)
            .then(out => res.status(out.code).send())
            .catch(err => res.status(err.code).json(err));
       });
}
