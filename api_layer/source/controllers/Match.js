const MatchModel = require('../models/Match');
const errors = require('../utility/error');


module.exports = (api) => {
    api.route('/Match/:id')
       .get((req, res) => {
            let id = req.params.id;
            MatchModel.findById(id, (err, match) => {
                    const errc = (match) ? 200 : 404;
                    const val = (match) ? match : {};
                    res.status(errc).json(match);
            })
            .catch(err => res.status(500).json(errors.ERROR_500));
       });

    /**
     * @api {delete} /Match/:id Delete the specified match
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
    api.route('/Match/:id')
       .delete((req, res) => {
            const id = req.params.id;
            MatchModel.findByIdAndRemove(id, (err, match) => {
                const errc = (match) ? 204 : 404;
                res.status(errc).send();
            })
            .catch(err => res.status(500).json(errors.ERROR_500));
       });
}
