const origin = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATHC');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Content-Type');
    next();
};

module.exports = {
    origin,
};
