const MatchModel = require('../models/Match');
//const errors = require('../utility/error');


module.exports = (api) => {
    api.route('/match/:id/:gs')
    .get((req, res) => {
        let id = req.params.id;
        let gs = req.params.status;
        MatchModel.findById(id, (err, match) => {
            if (match != null) {
                match.gs = true;
                match.save((err) => {
                    if (err) {
                        res.status(500).json({});
                    } else {
                        res.status(201).json(match);
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

