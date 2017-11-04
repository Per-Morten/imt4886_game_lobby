#pragma once
#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>
#include "json.hpp"

namespace kjapp
{
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

    enum class Query
    {
        ALL_MATCHES,
        NOT_IN_SESSION, // NOT IMPLEMENTED!
        IN_SESSION,
        NON_FULL_MATCHES,
        BY_NAME,
    };

    std::vector<nlohmann::json>
    getMatches(const std::string& gameToken,
               Query query = Query::ALL_MATCHES,
               const std::string& name = "");

    void
    deleteMatch(const std::string& gameToken,
                const std::string& matchId);

    enum class Status
    {
        NOT_IN_SESSION,
        IN_SESSION,
    };

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
