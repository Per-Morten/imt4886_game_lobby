const MatchModel = require('../models/Match');

module.exports = (api) => {
  api.route('/matches')
    .get((req, res) => {
      MatchModel.getAll()
        .then(list => res.json(list))
        .catch(err => res.json(err));
    });
};
