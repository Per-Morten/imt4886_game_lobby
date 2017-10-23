const MatchReportModel = require('../models/MatchReport');
const errors = require('../utility/error');

module.exports = (api) => {
    /**
     * @api {get} /match_reports/no_body/:gameToken Requests all match reports with given gameToken
     * @apiName GetMatchReportsNoBody
     * @apiGroup MatchReports
     * @apiDescription
     * Returns a JSON array of all match reports.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "_id": "59c7f0c9b0a0932165c058b6",
     *         "__v": 0,
     *         "matchID": "4ug12o5uuihgvygf1243",
     *         "gameToken": "aodhfa32048837bawioaf",
     *         "data": {
     *            "duration": 2000,
     *            "score": 50000,
     *         },
     *       }
     *     ]
     * @apiError (404) TokenNotFound The supplied GameToken was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/match_reports/no_body/:gameToken')
       .get((req, res) => {
            const gameToken = req.params.gameToken;
            MatchReportModel.getReportsWithToken(gameToken)
            .then(out => res.status(out.code).json(out.reports))
            .catch(err => res.status(err.code).json(err));
       });

    /**
     * @api {get} /match_reports/ Requests all match reports with given gameToken
     * @apiName GetMatchReportsJSONBody
     * @apiGroup MatchReports
     * @apiDescription
     * Acquires the gameToken from the body of the request and returns a JSON array of all match reports.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "_id": "59c7f0c9b0a0932165c058b6",
     *         "__v": 0,
     *         "matchID": "4ug12o5uuihgvygf1243",
     *         "gameToken": "aodhfa32048837bawioaf",
     *         "data": {
     *            "duration": 2000,
     *            "score": 50000,
     *         },
     *       }
     *     ]
     * @apiError (404) TokenNotFound The supplied GameToken was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/match_reports/')
       .get((req, res) => {
            const gameToken = req.body.gameToken;
            MatchReportModel.getReportsWithToken(gameToken)
            .then(out => res.status(out.code).json(out.reports))
            .catch(err => res.status(err.code).json(err));
       });

    /**
     * @api {get} /match_reports/average/no_body/:gameToken/:fieldName Requests an average value from a specified field and gameToken in all reports.
     * @apiName GetMatchReportAverageNoBody
     * @apiGroup MatchReports
     * @apiDescription
     * This request takes a gameToken and a string used to represent a field name within the variable data object of a report.
     * The request then returns the average of this field from all reports within a given gameToken/game.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiParam {String} fieldName The name of the field we want the average value from
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {850}
     *
     * @apiError (404) TokenNotFound The supplied GameToken was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
   api.route('/match_reports/average/no_body/:gameToken/:fieldName')
      .get((req, res) => {
            MatchReportModel.getAverage(req.params.gameToken, req.params.fieldName)
            .then(out => res.status(out.code).json(out.average))
            .catch(err => res.status(err.code).json(err));
      });

    /**
     * @api {get} /match_reports/average/ Requests an average value from a specified field and gameToken in all reports.
     * @apiName GetMatchReportAverageJSONBody
     * @apiGroup MatchReports
     * @apiDescription
     * This request takes a gameToken and a string used to represent a field name within the variable data object of a report. (Acquired from the body)
     * The request then returns the average of this field from all reports within a given gameToken/game.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiParam {String} fieldName The name of the field we want the average value from
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {850}
     *
     * @apiError (404) TokenNotFound The supplied GameToken was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
   api.route('/match_reports/average/')
      .get((req, res) => {
            MatchReportModel.getAverage(req.body.gameToken, req.body.fieldName)
            .then(out => res.status(out.code).json(out.average))
            .catch(err => res.status(err.code).json(err));
      });

    /**
     * @api {get} /match_reports/median/no_body/:gameToken/:fieldName Requests an average value from a specified field and gameToken in all reports.
     * @apiName GetMatchReportMedianNoBody
     * @apiGroup MatchReports
     * @apiDescription
     * This request takes a gameToken and a string used to represent a field name within the variable data object of a report.
     * The request then returns the median of this field from all reports within a given gameToken/game.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiParam {String} fieldName The name of the field we want the median value from
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {500}
     *
     * @apiError (404) TokenNotFound The supplied GameToken was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
   api.route('/match_reports/median/no_body/:gameToken/:fieldName')
      .get((req, res) => {
            MatchReportModel.getMedian(req.params.gameToken, req.params.fieldName)
            .then(out => res.status(out.code).json(out.median))
            .catch(err => res.status(err.code).json(err));
      });

    /**
     * @api {get} /match_reports/median/ Requests an median value from a specified field and gameToken in all reports.
     * @apiName GetMatchReportMedianJSONBody
     * @apiGroup MatchReports
     * @apiDescription
     * This request takes a gameToken and a string used to represent a field name within the variable data object of a report. (Acquired from the body)
     * The request then returns the median of this field from all reports within a given gameToken/game.
     *
     * @apiParam {String} gameToken The unique game token of a game.
     * @apiParam {String} fieldName The name of the field we want the median value from
     * @apiSuccess (200) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {500}
     *
     * @apiError (404) TokenNotFound The supplied GameToken was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
   api.route('/match_reports/median/')
      .get((req, res) => {
            MatchReportModel.getMedian(req.body.gameToken, req.body.fieldName)
            .then(out => res.status(out.code).json(out.median))
            .catch(err => res.status(err.code).json(err));
      });
}
