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


    api.route('/match/:id/:status')
    .put((req, res) => {
        let id = req.params.id;
        let status = req.params.status;
        MatchModel.findById(id, (err, match) => {
            if (match != null) {
                match.status = true;
                match.save((err) => {
                    if (err) {
                        res.status(500).json({});
                    } else {
                        res.status(204).json(match);
                    }
                })
            } else {
                status = 404;
            }

        }).catch(err => res.status(500).json({}));
    })
}


// module.exports = (api) => {
//     api.route('/Match/:id/:gameStatus')
//        .get((req, res) => {
//             let id = req.params.id;
//             let gs = req.params.gameStatus;
//             // MatchModel.findById(id, (err, match) => {
//             //         const errc = (match) ? 200 : 404;
//             //         const val = (match) ? match : {};
//             //         res.status(errc).json(match);

//             // })
//             // MatchModel.findById(gameStatus, (err, match) => {
//             //         const errc = (match) ? 200 : 404;
//             //         const val = (match) ? match : {};
//             //         gameStatus = 1;
//             //         MatchModel.save();
//             // }
//             // .catch(err => res.status(500).json({}));



// });
// }

