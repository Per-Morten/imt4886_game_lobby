const MatchModel = require('../models/Match');

module.exports = (api) => {
    api.route('/')
        .get((req, res) => {
            MatchModel.getAll()
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });

    /**
     * @api {get} /matches/ Request matches with given gameToken
     * @apiName GetMatchesJSONBody
     * @apiGroup Matches
     * @apiDescription
     * Returns a JSON array of all matches that contain the provided gameToken.
     * This array is empty if no matches were found.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     */
    api.route('/matches/')
         .get((req, res) => {
            MatchModel.findByToken(req.body.gameToken)
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });


    /**
     * @api {get} /matches/no_body/:gameToken Request matches with given gameToken
     * @apiName GetMatchesNoBody
     * @apiGroup Matches
     * @apiDescription
     * Returns a JSON array of all matches that contain the provided gameToken.
     * This array is empty if no matches were found.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     */
    api.route('/matches/no_body/:gameToken')
         .get((req, res) => {
            MatchModel.findByToken(req.params.gameToken)
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });

    /**
     * @api {get} /matches/in_session/ Request matches that are in session with given gameToken
     * @apiName GetMatchesInSessionJSONBody
     * @apiGroup Matches
     * @apiDescription
     * Returns a list of all matches that are in session and contain the provided gameToken.
     * This list is empty if no matches were found.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     */
    api.route('/matches/in_session/')
        .get((req, res) => {
            MatchModel.findByTokenInSession(req.body.gameToken)
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });

    /**
     * @api {get} /matches/in_session/no_body/:gameToken Request matches that are in session with given gameToken
     * @apiName GetMatchesInSessionNoBody
     * @apiGroup Matches
     * @apiDescription
     * Returns a list of all matches that are in session and contain the provided gameToken.
     * This list is empty if no matches were found.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     */
    api.route('/matches/in_session/no_body/:gameToken')
        .get((req, res) => {
            MatchModel.findByTokenInSession(req.params.gameToken)
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });

    /**
     * @api {get} /matches/not_in_session/ Request matches that are not in session with given gameToken
     * @apiName GetMatchesNotInSession
     * @apiGroup Matches
     * @apiDescription
     * Returns a list of all matches that are not in session and contain the provided gameToken.
     * This list is empty if no matches were found.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     */
    api.route('/matches/not_in_session/')
        .get((req, res) => {
            MatchModel.findByTokenNotInSession(req.body.gameToken)
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });

    /**
     * @api {get} /matches/not_in_session/no_body/:gameToken Request matches that are not in session with given gameToken
     * @apiName GetMatchesNotInSessionNoBody
     * @apiGroup Matches
     * @apiDescription
     * Returns a list of all matches that are not in session and contain the provided gameToken.
     * This list is empty if no matches were found.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     */
    api.route('/matches/not_in_session/no_body/:gameToken')
        .get((req, res) => {
            MatchModel.findByTokenNotInSession(req.params.gameToken)
                .then(list => res.json(list))
                .catch(err => res.json(err));
        });

    /**
     * @api {get} /matches/not_full/ Request all the matches that are not full with a given gameToken
     * @apiName GetMatchesNotFullJSONBody
     * @apiGroup Matches
     * @apiDescription
     * Returns a JSON array of all matches where playerCount < maxPlayerCount.
     * The array does not include matches that have not specified maxPlayerCount.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       { _id: '59da7d0e704a440b4fc6d840',
     *         name: 'Test Match 2',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 9007199254740991,
     *         playerCount: 1 },
     *       { _id: '59da7d0e704a440b4fc6d842',
     *         name: 'Test Match 4',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 36,
     *         playerCount: 35 },
     *       { _id: '59da7d0e704a440b4fc6d843',
     *         name: 'Test Match 5',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 36,
     *         playerCount: 22 }
     *      ]
     *
     * @apiError (404) TokenNotFound The supplied GameToken was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/matches/not_full')
        .get((req, res) => {
            MatchModel.findByTokenNotFull(req.body.gameToken)
                .then(out => res.status(out.code).json(out.matches))
                .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {get} /matches/not_full/no_body/:gameToken Request all the matches that are not full with a given gameToken
     * @apiName GetMatchesNotFullNoBody
     * @apiGroup Matches
     * @apiDescription
     * Returns a JSON array of all matches where playerCount < maxPlayerCount.
     * The array does not include matches that have not specified maxPlayerCount.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       { _id: '59da7d0e704a440b4fc6d840',
     *         name: 'Test Match 2',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 9007199254740991,
     *         playerCount: 1 },
     *       { _id: '59da7d0e704a440b4fc6d842',
     *         name: 'Test Match 4',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 36,
     *         playerCount: 35 },
     *       { _id: '59da7d0e704a440b4fc6d843',
     *         name: 'Test Match 5',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 36,
     *         playerCount: 22 }
     *      ]
     *
     * @apiError (404) TokenNotFound The supplied GameToken was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/matches/not_full/no_body/:gameToken')
        .get((req, res) => {
            MatchModel.findByTokenNotFull(req.params.gameToken)
                .then(out => res.status(out.code).json(out.matches))
                .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {get} /matches/with_name/no_body/:gameToken/:name Requests all matches with a given token and partially matched name.
     * @apiName GetMatchesWithNameNoBody
     * @apiGroup Matches
     * @apiDescription
     * Returns a JSON array of all matches that partially match the given name.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiParam {String} name The match name we are searching for
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       { _id: '59da7d0e704a440b4fc6d840',
     *         name: 'Test Match 2',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 9007199254740991,
     *         playerCount: 1 },
     *       { _id: '59da7d0e704a440b4fc6d842',
     *         name: 'Test Match 4',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 36,
     *         playerCount: 35 },
     *       { _id: '59da7d0e704a440b4fc6d843',
     *         name: 'Test Match 5',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 36,
     *         playerCount: 22 }
     *      ]
     *
     * @apiError (404) Supplied gameToken was not found or no matches with given name were found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/matches/with_name/no_body/:gameToken/:name')
        .get((req, res) => {
            MatchModel.findByTokenAndName(req.params.gameToken, req.params.name)
                .then(out => res.status(out.code).json(out.matches))
                .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {get} /matches/with_name Requests all matches with a given token and partially matched name.
     * @apiName GetMatchesWithNameJSONBody
     * @apiGroup Matches
     * @apiDescription
     * Returns a JSON array of all matches that partially match the given name.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiParam {String} name The match name we are searching for
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       { _id: '59da7d0e704a440b4fc6d840',
     *         name: 'Test Match 2',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 9007199254740991,
     *         playerCount: 1 },
     *       { _id: '59da7d0e704a440b4fc6d842',
     *         name: 'Test Match 4',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 36,
     *         playerCount: 35 },
     *       { _id: '59da7d0e704a440b4fc6d843',
     *         name: 'Test Match 5',
     *         gameToken: '59da7d0e704a440b4fc6d83d',
     *         status: 0,
     *         hostIP: '127.0.0.1',
     *         hostPort: 3000,
     *         __v: 0,
     *         maxPlayerCount: 36,
     *         playerCount: 22 }
     *      ]
     *
     * @apiError (404) Supplied gameToken was not found or no matches with given name were found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/matches/with_name/')
        .get((req, res) => {
            MatchModel.findByTokenAndName(req.body.gameToken, req.body.name)
                .then(out => res.status(out.code).json(out.matches))
                .catch(err => res.status(err.code).json(err));
        });
};
