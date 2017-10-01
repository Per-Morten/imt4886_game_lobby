const MatchModel = require('../models/Match');
//const errors = require('../utility/error');



module.exports = (api) => {

     api.route('/match/:id')
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
   * @api {put} /match/:id/:status update status of specified match
   * @apiName UpdateMatchStatus
   * @apiGroup Match
   * @apiDescription
   *   The status of the match with the specified ID is updated
   *   Returns 204 on success,
   *   404 if the match with requested ID couldn't be found.
   *
   * @apiParam {Id} id the unique ID of the match.
   * @apiParam {Number={0..1}} status the current status of the match. true if started. false if not.
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
    api.route('/match/:id/:status')
       .put((req, res) => {
            const id = req.params.id;
            const status = req.params.status;
            MatchModel.updateStatus(id, status)
            .then(out => res.status(out.code).send())
            .catch(err => res.status(err.code).json(err));
        });
}
