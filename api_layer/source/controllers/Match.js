const MatchModel = require('../models/Match');
//const errors = require('../utility/error');


module.exports = (api) => {
    api.route('/match/:id/:gs')
    .get((req, res) => {
        let id = req.params.id;
        let gs = req.params.status;
        MatchModel.findById(id, (err, match) => {
            if (match != null) { // hvis vi finner objektet vi er ute etter
                match.gs = true;  //Gjøre endringer her
                match.save((err) => { //MatchModel.save eller match.save
                    if (err) {
                        res.status(500).json({});   //Error når du prøvde å lagre obj
                    } else {
                        res.status(201).json(match); //Alt ok, 201 modified object
                    }
                })
            } else {
                status = 404;   //Fant ikke objekt
            }

            //console.log('id');

        }).catch(err => res.status(500).json({})); //Error når du prøvde å hente objekt
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


// MatchModel.findById(id, (err, match) => {
//     if (match != null) { // hvis vi finner objektet vi er ute etter
//         match.gameStatus = true;  //Gjøre endringer her
//         match.save((err) => { //MatchModel.save eller match.save
//             if (err) {
//                 res.status(500).json({});   //Error når du prøvde å lagre obj
//             } else {
//                 res.status(201).json(match); //Alt ok, 201 modified object
//             }
//         }
//     } else {
//         res.status = 404;   //Fant ikke objekt
//     }

// )}.catch(err => res.status(500).json({}))); //Error når du prøvde å hente objekt
