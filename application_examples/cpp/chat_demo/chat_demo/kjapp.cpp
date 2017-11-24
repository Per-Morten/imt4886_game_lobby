#include "kjapp.h"

#include <cinttypes>
#include <cstdio>
#include <cstring>
#include <memory>
#include <stdexcept>

#include <curl/curl.h>

// Turn off unsafe warning for sscanf
#ifdef _MSC_VER
#pragma warning(push)
#pragma warning(disable: 4996)
#endif

const std::string KJAPP_URL = "up.imt.hig.no:8333";

struct CurlDeleter
{
    void operator()(CURL* curl)
    {
        if (curl)
        {
            curl_easy_cleanup(curl);
        }
    }
};

using CurlHandle = std::unique_ptr<CURL, CurlDeleter>;

CurlHandle
createCurlHandle()
{
    CURL* curl = curl_easy_init();
    if (!curl)
    {
        throw std::runtime_error("Could not init curl");
    }

    curl_easy_setopt(curl, CURLOPT_FAILONERROR, 1);

    return CurlHandle(curl);
}

void
handleCurlError(const CurlHandle& handle, CURLcode code)
{
    std::string error = std::string("kjapp curl error: ") + curl_easy_strerror(code);

    if (code == CURLE_HTTP_RETURNED_ERROR)
    {
        long code = 0;
        curl_easy_getinfo(handle.get(), CURLINFO_RESPONSE_CODE, &code);
        error += std::string(". Error code:") + std::to_string(code);
    }

    throw std::runtime_error(error.c_str());
}

using CurlCallback = std::size_t(*)(void*, std::size_t, std::size_t, void*);

void
executeCurlRequest(const std::string& requestType,
                   const std::string& url,
                   const std::string& data,
                   CurlCallback callback = nullptr,
                   void* callbackData = nullptr)
{
    auto handle = createCurlHandle();

    if (callback)
    {
        curl_easy_setopt(handle.get(), CURLOPT_WRITEFUNCTION, callback);
        curl_easy_setopt(handle.get(), CURLOPT_WRITEDATA, callbackData);
    }

    curl_easy_setopt(handle.get(), CURLOPT_CUSTOMREQUEST, requestType.c_str());
    curl_easy_setopt(handle.get(), CURLOPT_URL, url.c_str());

    // Not necessarily cool!
    // But needed it to work on windows
    // Should be fixed if project continues:
    // https://curl.haxx.se/libcurl/c/CURLOPT_SSL_VERIFYPEER.html
    curl_easy_setopt(handle.get(), CURLOPT_SSL_VERIFYPEER, 0);

    if (data.size() != 0)
    {
        curl_easy_setopt(handle.get(), CURLOPT_POSTFIELDS, data.data());
        curl_easy_setopt(handle.get(), CURLOPT_POSTFIELDSIZE, data.size());
    }

    curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(handle.get(), CURLOPT_HTTPHEADER, headers);

    CURLcode res = curl_easy_perform(handle.get());

    if (res != CURLE_OK)
    {
        curl_slist_free_all(headers);
        handleCurlError(handle, res);
    }

    curl_slist_free_all(headers);
}

namespace
{
    namespace local
    {
        std::size_t
        curlCallback(void* contents,
                     std::size_t size,
                     std::size_t nmemb,
                     void* userData)
        {
            std::size_t realSize = size * nmemb;

            auto str = static_cast<std::string*>(userData);
            str->append(static_cast<char*>(contents), realSize);

            return size * nmemb;
        };
    }
}

std::string
kjapp::getMyIP()
{
    std::string str;
    executeCurlRequest("GET",
                       "https://api.ipify.org?format=json",
                       "",
                       local::curlCallback,
                       &str);

    auto json = nlohmann::json::parse(str);

    return json["ip"];
}

nlohmann::json
kjapp::hostMatch(const std::string& gameToken,
                 const std::string& name,
                 const std::string& hostIP,
                 const std::uint16_t hostPort,
                 const std::size_t maxPlayerCount,
                 const std::size_t playerCount,
                 const std::string& miscInfo)
{
    std::uint8_t octets[4];
    auto validFields = std::sscanf(hostIP.c_str(),
                                   "%" SCNu8 ".%" SCNu8 ".%" SCNu8 ".%" SCNu8 "",
                                   &octets[0], &octets[1], &octets[2], &octets[3]);

    if (validFields != 4 || maxPlayerCount == 0 ||
        playerCount > maxPlayerCount || miscInfo.empty() ||
        name.empty())
    {
        throw std::invalid_argument("kjapp error: Invalid argument");
    }

    nlohmann::json json =
    {
        {"gameToken", gameToken},
        {"name", name},
        {"hostIP", hostIP},
        {"hostPort", hostPort},
        {"maxPlayerCount", maxPlayerCount},
        {"playerCount", playerCount},
        {"miscInfo", miscInfo},
    };

    std::string out;
    executeCurlRequest("POST",
                       KJAPP_URL + "/match/",
                       json.dump(),
                       local::curlCallback,
                       &out);

    return nlohmann::json::parse(out);
}

std::vector<nlohmann::json>
kjapp::getMatches(const std::string& gameToken,
                  kjapp::Query query,
                  const std::string& name)
{
    std::string url = KJAPP_URL + "/matches/";

    switch (query)
    {
        case Query::ALL_MATCHES:
            url += "no_body/" + gameToken;
        break;

        case Query::IN_SESSION:
            url += "in_session/no_body/" + gameToken;
        break;

        case Query::NON_FULL_MATCHES:
            url += "not_full/no_body/" + gameToken;
        break;

        case Query::BY_NAME:
            if (name.empty())
                throw std::invalid_argument("kjapp error: Invalid argument");

            url += "with_name/no_body/" + gameToken + "/" + name;
        break;

        case Query::NOT_IN_SESSION:
            url += "not_in_session/no_body/" + gameToken;
        break;

        default:
            std::fprintf(stderr, "Query is not supported yet\n");
            return {};
        break;
    }

    std::string str;
    executeCurlRequest("GET",
                       url,
                       "",
                       local::curlCallback,
                       &str);

    auto jsonArray = nlohmann::json::parse(str);
    std::vector<nlohmann::json> output;
    for (const auto& item : jsonArray)
        output.push_back(item);

    return output;
}

void
kjapp::deleteMatch(const std::string& gameToken,
                   const std::string& matchId)
{
    nlohmann::json json =
    {
        {"gameToken", gameToken},
        {"id", matchId},
    };

    executeCurlRequest("DELETE",
                       KJAPP_URL + "/match/",
                       json.dump());
}

void
kjapp::updateMatchStatus(const std::string& gameToken,
                         const std::string& matchId,
                         Status status)
{

    nlohmann::json json =
    {
        {"gameToken", gameToken},
        {"id", matchId},
        {"status", static_cast<int>(status)},
    };

    executeCurlRequest("PUT",
                       KJAPP_URL + "/match/status",
                       json.dump());
}

void
kjapp::updatePlayerCount(const std::string& gameToken,
                         const std::string& matchId,
                         const std::size_t playerCount)
{
    nlohmann::json json =
    {
        {"gameToken", gameToken},
        {"id", matchId},
        {"playerCount", playerCount},
    };

    executeCurlRequest("PUT",
                       KJAPP_URL + "/match/player_count",
                       json.dump());
}

nlohmann::json
kjapp::postMatchReport(const std::string& gameToken,
                       const std::string& matchId,
                       const nlohmann::json& data)
{
    nlohmann::json json =
    {
        {"gameToken", gameToken},
        {"matchID", matchId},
        {"data", data},
    };

    std::string out;
    executeCurlRequest("POST",
                       KJAPP_URL + "/match_report/",
                       json.dump(),
                       local::curlCallback,
                       &out);

    return nlohmann::json::parse(out);
}

#ifdef _MSC_VER
#pragma warning(pop)
#endif
