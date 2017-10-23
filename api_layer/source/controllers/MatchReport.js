const MatchReportModel = require('../models/MatchReport');
const errors = require('../utility/error');

module.exports = (api) => {
    /**
     * @api {post} /match_report/ Create a match report with given data
     * @apiName CreateMatchReport
     * @apiGroup MatchReport
     * @apiDescription
     *  Creates a match report with the given JSON object.
     *  Returns 200 on success together with the newly created match report.
     *
     * @apiParam (MatchReportInfo){String} matchID The ID of the match that this report belongs to.
     * @apiParam (MatchReportInfo){String} gameToken The gameToken belonging to this game
     * @apiParam (MatchReportInfo){Object} data An object containing arbitrary data from the match.
     *
     * @apiSuccess (200) _id The unique identifier of the match.
     * @apiSuccess (200) __v The version of the match in the database.
     * @apiSuccess (200) matchID The ID of the match that this report belongs to.
     * @apiSuccess (200) gameToken The identifier of the game the match belongs to.
     * @apiSuccess (200) data An object containing custom data that the developer adds to a report
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "59c7f0c9b0a0932165c058b6",
     *       "__v": 0,
     *       "matchID": "4ug12o5uuihgvygf1243",
     *       "gameToken": "aodhfa32048837bawioaf",
     *       "data": {
     *          "duration": 2000,
     *          "score": 50000,
     *       },
     *     }
     *
     * @apiError (403) InvalidToken Invalid gameToken or gameToken that has not yet been accepted was sent.
     *                 Tokens need to be accepted by an admin before use.
     */
    api.route('/match_report/')
       .post((req, res) => {
            const info = req.body;
            MatchReportModel.createReport(info)
            .then(out => res.status(out.code).json(out.report))
            .catch(err => res.status(err.code).json(err));
        });

    /**
     * @api {delete} /match_report/ Delete the specified match report
     * @apiName DeleteMatchReport
     * @apiGroup MatchReport
     * @apiDescription
     *  Deletes the match report with the requested id.
     *  Returns 204 on success,
     *  404 if the match with requested id couldn't be found.
     *
     * @apiParam {Id} id The unique ID of the match report.
     *
     * @apiSuccess (204) Success
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 OK
     *     {}
     *
     * @apiError (404) MatchReportNotFound The supplied ID was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {}
     */
    api.route('/match_report/')
       .delete((req, res) => {
            MatchReportModel.deleteReport(req.body.id)
            .then(out => res.status(out.code).send())
            .catch(err => res.status(err.code).json(err));
       });
}
