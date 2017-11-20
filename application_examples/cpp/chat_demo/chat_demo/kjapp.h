#pragma once
#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>

#include "json.hpp"

/////////////////////////////////////////////////////////////////////
/// \brief
///     Contains all the resources needed to get kjapp game lobby
///     system to work.
///
/// \details
///     The kjapp game lobby system is a game lobby system
///     that uses HTTP requests to communicate with a database.
///     This namespace contains wrappers for these HTTP requests
///     to allow developers to easily integrate simple lobby
///     functionality into their games.
///
/// \par JSON
///     Kjapp in general uses a lot of json objects, as these
///     are the ones that are most natural to work with when
///     discussing HTTP web requests.
///     For this we have decided on using nlohmann json library.
///
/// \par libcurl
///     For the HTTP requests we use libcurl.
///
/// \par game tokens
///     To use the kjapp game lobby system developers need to
///     register their games, and apply for a game token.
///     These tokens are api keys that are used by all kjapp
///     functions to identify which game different matches
///     and reports belong to.
///     One can apply for a game token, but the token must be
///     valid before it can be used for anything productive.
///
/// \par Multiple threads
///     The kjapp functions are blocking calls, and can be
///     run in a separate thread. However, be careful about
///     doing kjapp calls from multiple threads at the same time.
///     Nothing in kjapp explicitly should cause any issues,
///     but there might be situations where curl does not like it.
///
/// \par Validation and Error handling
///     Most validation happens on the server side of kjapp glm.
///     However, to make it a bit easier to work with, the most
///     common and easy to make errors results in an exception.
///     These are mentioned in more detail in documentation of
///     different functions.
///     In general the rule is that if something is really obvious
///     like gameToken and matchId not having a length of 0
///     is not checked, but more hard to spot errors, like
///     miscInfo having a length of 0, will result in invalid
///     argument exceptions.
///     Any HTTP errors, like 404, will throw a runtime exception.
///
/// \see <a href="https://github.com/nlohmann/json">nlohmann json</a>
/// \see <a href="https://curl.haxx.se/libcurl/c/libcurl.html">libcurl</a>
/// \see <a href="https://curl.haxx.se/libcurl/c/threadsafe.html">curl thread safety</a>
/////////////////////////////////////////////////////////////////////
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
    ///     created.
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
    /// \param playerCount
    ///     The current number of players in the match.
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
    ///
    /// \throws std::invalid_argument
    ///     * miscInfo.empty() == true.
    ///     * name.empty() == true.
    ///     * hostIP is not an IPv4 numeric IP.
    ///     * maxPlayerCount == 0.
    ///     * playerCount > maxPlayerCount.
    /////////////////////////////////////////////////////////////////
    nlohmann::json
    hostMatch(const std::string& gameToken,
              const std::string& name,
              const std::string& hostIP,
              const std::uint16_t hostPort,
              const std::size_t maxPlayerCount,
              const std::size_t playerCount = 0,
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
    ///
    /// \throw std::invalid_argument
    ///     * query == Query::BY_NAME && name.empty() == true
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
    /////////////////////////////////////////////////////////////////
    void
    deleteMatch(const std::string& gameToken,
                const std::string& matchId);

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Updates the status of the match belonging to the game
    ///     with the specified game token, and identified by
    ///     the specified matchId.
    ///
    /// \details
    ///     Informs the kjapp game lobby that a match should be
    ///     have its status changed.
    ///     The most normal usage of this is to inform
    ///     the game lobby that a match is set to in session
    ///     which will then filter it out of getMatches queried
    ///     for not in session.
    ///
    /// \param gameToken
    ///     The gameToken of the game that the match belongs to.
    ///
    /// \param matchId
    ///     The id of the match that is supposed to be updated.
    ///
    /// \param status
    ///     The new status of the match.
    ///
    /// \throws std::runtime_exception
    ///     * A curl handle couldn't be created.
    ///     * The HTTP request returned an error code, i.e. 40X
    /////////////////////////////////////////////////////////////////
    void
    updateMatchStatus(const std::string& gameToken,
                      const std::string& matchId,
                      Status status);

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Updates the number of players of the match belonging
    ///     to the game with the specified game token,
    ///     and identified by the specified matchId.
    ///
    /// \details
    ///     Informs the kjapp game lobby that a match should be
    ///     have its playerCount changed.
    ///     This is usually done when a player connects to
    ///     or drops out of a game.
    ///
    /// \param gameToken
    ///     The gameToken of the game that the match belongs to.
    ///
    /// \param matchId
    ///     The id of the match that is supposed to be updated.
    ///
    /// \param playerCount
    ///     The new playerCount of the match.
    ///
    /// \throws std::runtime_exception
    ///     * A curl handle couldn't be created.
    ///     * The HTTP request returned an error code, i.e. 40X
    /////////////////////////////////////////////////////////////////
    void
    updatePlayerCount(const std::string& gameToken,
                      const std::string& matchId,
                      std::size_t playerCount);

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Sends a match report to the kjapp game lobby.
    ///
    /// \details
    ///     The kjapp game lobby is sent a match report that will
    ///     belong to the game identified by the gameToken.
    ///
    /// \param gameToken
    ///     The gameToken of the game that the report belongs to.
    ///     The gameToken must be valid, otherwise the post request
    ///     will fail.
    ///
    /// \param matchId
    ///     The id of the match this report was generated from.
    ///
    /// \param data
    ///     A json object containing all the data that the
    ///     developer wants to restore.
    ///
    /// \returns
    ///     A json object containing all the relevant information
    ///     of the report. This is in the form of:
    ///     \code{.cpp}
    ///     {
    ///         "_id": "59da7d0e704a440b4fc6d83d",
    ///         "__v": 0,
    ///         "matchId": "59c7f0c9b0a0932165c058b6",
    ///         "gameToken": "59ec8be7890cd692461bb7d4",
    ///         "data":
    ///         {
    ///             "duration": 2000,
    ///             "score": 50000,
    ///         }
    ///     }
    ///     \endcode
    ///
    /// \throws std::runtime_exception
    ///     * A curl handle couldn't be created.
    ///     * The HTTP request returned an error code, i.e. 40X
    /////////////////////////////////////////////////////////////////
    nlohmann::json
    postMatchReport(const std::string& gameToken,
                    const std::string& matchId,
                    const nlohmann::json& data);
}
