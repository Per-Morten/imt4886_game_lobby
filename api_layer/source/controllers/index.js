module.exports = (api) => {
    require('./Match')(api);
    require('./Matches')(api);
    require('./MatchReport')(api);
    require('./MatchReports')(api);
    require('./Game')(api);
    require('./Games')(api);
};
