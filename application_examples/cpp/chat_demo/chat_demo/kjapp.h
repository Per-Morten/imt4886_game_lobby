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
