module.exports = function(app)
{
    let migrate = function(error)
    {
        if (error)
            throw error;

        let matches =
        [
        {
            gameToken: "kjapptest",
            status: 0,
            hostIP: "localhost",
            hostPort: 7777
        }
        ];

        let validate = function(error, matches)
        {
            if (error)
                throw error;

            console.log("Matches created: \n", matches);
        }

        app.models.Match.create(matches, validate);
    }

    app.datasources.glmDS.automigrate("Match", migrate);
}
