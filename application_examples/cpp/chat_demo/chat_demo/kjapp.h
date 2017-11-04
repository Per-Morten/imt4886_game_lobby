#pragma once
#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>
#include "json.hpp"

namespace kjapp
{
    /////////////////////////////////////////////////////////////////
    /// \enum kjapp::Query
    /// \brief
    ///     Different categories of queries that can be done on
    ///     the kjapp database over matches.
    ///
    /// \var kjapp::Query::ALL_MATCHES
    ///     Gets all the matches belonging to a specified
    ///     game token.
    ///
    /// \var kjapp::Query::NOT_IN_SESSION
    ///     Gets all the matches belonging to a specified
    ///     game token that are not in session.
    ///
    /// \var kjapp::Query::IN_SESSION
    ///     Gets all the matches belonging to a specified
    ///     game token that are in session.
    ///
    /// \var kjapp::Query::NON_FULL_MATCHES
    ///     Gets all the matches belonging to a specified
    ///     game token that are not full.
    ///
    /// \var kjapp::Query::BY_NAME
    ///     Gets all the matches belonging to a specified
    ///     game token with a specified name.
    ///     Both partial and full names can be specified.
    /////////////////////////////////////////////////////////////////
    enum class Query
    {
        ALL_MATCHES,
        NOT_IN_SESSION,
        IN_SESSION,
        NON_FULL_MATCHES,
        BY_NAME,
    };

    /////////////////////////////////////////////////////////////////
    /// \enum kjapp::Status
    /// \brief
    ///     The status of a match. Is it in session or not.
    ///
    /// \var kjapp::Status::NOT_IN_SESSION
    ///     This means that the match has not yet been started,
    ///     or that it has been stopped.
    ///
    /// \var kjapp::Status::IN_SESSION
    ///     This means that the match is currently running.
    /////////////////////////////////////////////////////////////////
    enum class Status
    {
        NOT_IN_SESSION,
        IN_SESSION,
    };

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Returns the external IP address of this computer.
    ///
    /// \details
    ///     Does a web request to a remote service to get the
    ///     external IP of this computer back.
    ///
    /// \returns
    ///     String containing the external IP address of
    ///     the computer.
    ///
    /// \throws std::runtime_exception
    ///     * A curl handle couldn't be created.
    ///     * The HTTP request returned an error code, i.e. 40X
    /////////////////////////////////////////////////////////////////
    std::string
    getMyIP();

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Reports to the kjapp game lobby that a match has been
    ///     started.
    ///
    /// \details
    ///     The kjapp game lobby is notified about the creation
    ///     of a match.
    ///     After creation, this match will be included
    ///     in relevant getMatches queries, and players
    ///     can join the match.
    ///
    /// \param gameToken
    ///     The gameToken of the game that is being played.
    ///     The gameToken must be valid, otherwise post requests
    ///     of the match will fail.
    ///
    /// \param name
    ///     The name of the match, this does not need to be unique.
    ///
    /// \param hostIP
    ///     The ip address of the computer that is hosting
    ///     the match.
    ///
    /// \param hostPort
    ///     The port that players should use to connect to
    ///     the match.
    ///
    /// \param maxPlayerCount
    ///     The maximum number of players that can join this match.
    ///     Must be > 0.
    ///
    /// \param miscInfo
    ///     A string containing any other information about the
    ///     match.
    ///     This is decided by the developer, and could for example
    ///     be a description, or even a whole json object.
    ///     Note: Must have length > 0, even if just empty space.
    ///
    /// \returns
    ///     A json object containing all the relevant information
    ///     of the match. This is in the form of:
    ///     \code{.cpp}
    ///     {
    ///         "_id": "59c7f0c9b0a0932165c058b6",
    ///         "__v": 0,
    ///         "name": "Match 1",
    ///         "gameToken": "59ec8be7890cd692461bb7d4",
    ///         "status": 1,
    ///         "hostIP": "127.0.0.0",
    ///         "hostPort": 3000,
    ///         "playerCount": 1,
    ///         "miscInfo": "Description of match"
    ///     }
    ///     \endcode
    ///
    /// \throws std::runtime_exception
    ///     * A curl handle couldn't be created.
    ///     * The HTTP request returned an error code, i.e. 40X
    ///     * miscInfo has a length of 0.
    /////////////////////////////////////////////////////////////////
    nlohmann::json
    hostMatch(const std::string& gameToken,
              const std::string& name,
              const std::string& hostIP,
              const std::uint16_t hostPort,
              const std::size_t maxPlayerCount,
              const std::string& miscInfo = " ");

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Returns all the matches belonging to the specified
    ///     game token that also fits within the specified query.
    ///
    /// \details
    ///     The kjapp game lobby is queried for any matches
    ///     belonging to the specified game token, that also
    ///     satisfies the criteria specified by query.
    ///
    /// \param gameToken
    ///     The gameToken of the game that is being queried
    ///     for.
    ///
    /// \param query
    ///     The query/filter that the matches should be filtered
    ///     through.
    ///
    /// \param name
    ///     Only used in the case where query == Query::BY_NAME.
    ///     Partial or full name of the match you are searching
    ///     for.
    ///
    /// \returns
    ///     A vector of json match objects, same as the ones
    ///     seen in kjapp::hostMatch.
    ///
    /// \throws std::runtime_exception
    ///     * A curl handle couldn't be created.
    ///     * The HTTP request returned an error code, i.e. 40X
    ///     * miscInfo has a length of 0.
    ///
    /// \see kjapp::Query
    /////////////////////////////////////////////////////////////////
    std::vector<nlohmann::json>
    getMatches(const std::string& gameToken,
               Query query = Query::ALL_MATCHES,
               const std::string& name = "");

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Deletes the match with the id matchId, belonging
    ///     to the game specified by gameToken from the kjapp
    ///     match database.
    ///
    /// \details
    ///     Informs the kjapp game lobby that a match should be
    ///     deleted.
    ///     The match is identified by the matchId and the
    ///     game token.
    ///
    /// \param gameToken
    ///     The gameToken of the game that the match to be deleted
    ///     belongs to.
    ///
    /// \param matchId
    ///     The id of the match that is supposed to be deleted.
    ///
    /// \throws std::runtime_exception
    ///     * A curl handle couldn't be created.
    ///     * The HTTP request returned an error code, i.e. 40X
    ///     * miscInfo has a length of 0.
    /////////////////////////////////////////////////////////////////
    void
    deleteMatch(const std::string& gameToken,
                const std::string& matchId);

    void
    updateMatchStatus(const std::string& gameToken,
                      const std::string& matchId,
                      Status status);

    void
    updatePlayerCount(const std::string& gameToken,
                      const std::string& matchId,
                      std::size_t playerCount);

    nlohmann::json
    postMatchReport(const std::string& gameToken,
                    const std::string& matchId,
                    const nlohmann::json& data);
}
