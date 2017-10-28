#pragma once
#include <cstddef>
#include <cstdint>
#include <string>
#include <curl/curl.h>
#include "json.hpp"

namespace kjapp
{
    std::string
    getMyIP();

    nlohmann::json
    hostMatch(const std::string& gameToken,
              const std::string& name,
              const std::string& hostIP,
              const std::uint16_t hostPort,
              const std::size_t maxPlayerCount);

    nlohmann::json
    hostMatch(const std::string& gameToken,
              const std::string& name,
              const std::string& hostIP,
              const std::uint16_t hostPort,
              const std::size_t maxPlayerCount,
              const nlohmann::json& miscInfo);

    enum class Query
    {
        ALL_MATCHES,
        NOT_IN_SESSION, // NOT IMPLEMENTED!
        IN_SESSION,
        NON_FULL_MATCHES,
        BY_NAME, // NOT IMPLEMENTED!
    };

    std::vector<nlohmann::json>
    getMatches(const std::string& gameToken,
               Query query = Query::ALL_MATCHES,
               const std::string& name = "");

}
