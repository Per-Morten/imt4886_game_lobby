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
