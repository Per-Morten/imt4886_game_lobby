#include "kjapp.h"

#include <cstdio>
#include <cstring>
#include <memory>
#include <stdexcept>

#include <curl/curl.h>

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

using curlCallback = std::size_t(*)(void*, std::size_t, std::size_t, void*);

void
executeCurlRequest(const std::string& requestType,
                   const std::string& url,
                   const std::string& data,
                   curlCallback callback = nullptr,
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

    curl_easy_setopt(handle.get(), CURLOPT_POSTFIELDS, data.data());
    curl_easy_setopt(handle.get(), CURLOPT_POSTFIELDSIZE, data.size());

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
        getMyIPCallback(void* contents, std::size_t size, std::size_t nmemb, void* userData)
        {
            auto data = static_cast<std::string*>(userData);

            std::size_t realSize = size * nmemb;
            std::string parseString(static_cast<char*>(contents), realSize);
            nlohmann::json json = nlohmann::json::parse(parseString);
            *data = json["ip"];

            return size * nmemb;
        }
    }
}

std::string
kjapp::getMyIP()
{
    auto handle = createCurlHandle();
    curl_easy_setopt(handle.get(), CURLOPT_WRITEFUNCTION, local::getMyIPCallback);

    std::string output;
    curl_easy_setopt(handle.get(), CURLOPT_WRITEDATA, &output);

    const auto url = "https://api.ipify.org?format=json";

    curl_easy_setopt(handle.get(), CURLOPT_URL, url);

    const auto res = curl_easy_perform(handle.get());

    if (res != CURLE_OK)
        throw std::runtime_error(curl_easy_strerror(res));

    return output;
}

namespace
{
    namespace local
    {
        std::size_t
        hostMatchCallback(void* contents, std::size_t size, std::size_t nmemb, void* userData)
        {
            std::size_t realSize = size * nmemb;

            // Contents isn't null terminated, and I don't want to rely on Json library there,
            // so just ensuring that the std::string never reads more than realSize number of characters.
            std::string jsonString(static_cast<char*>(contents), realSize);
            nlohmann::json* output = static_cast<nlohmann::json*>(userData);

            // Don't trust implicit constructor, always gets the parsing wrong..... -.-...
            *output = nlohmann::json::parse(jsonString);
            return size * nmemb;
        };
    }
}

nlohmann::json
kjapp::hostMatch(const std::string& gameToken,
                 const std::string& name,
                 const std::string& hostIP,
                 const std::uint16_t hostPort,
                 const std::size_t maxPlayerCount,
                 const std::string& miscInfo)
{
    auto handle = createCurlHandle();

    // Setup callback
    curl_easy_setopt(handle.get(), CURLOPT_WRITEFUNCTION, local::hostMatchCallback);

    nlohmann::json output;
    curl_easy_setopt(handle.get(), CURLOPT_WRITEDATA, &output);

    // Prepare for post call
    nlohmann::json package =
    {
        {"gameToken", gameToken},
        {"name", name},
        {"hostIP", hostIP},
        {"hostPort", hostPort},
        {"maxPlayerCount", maxPlayerCount},
        {"miscInfo", miscInfo},
    };

    auto jsonString = package.dump();
    curl_easy_setopt(handle.get(), CURLOPT_POSTFIELDS, jsonString.data());
    curl_easy_setopt(handle.get(), CURLOPT_POSTFIELDSIZE, jsonString.size());

    // Set content type
    curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(handle.get(), CURLOPT_HTTPHEADER, headers);

    // Set address
    std::string url = KJAPP_URL + "/match/";
    curl_easy_setopt(handle.get(), CURLOPT_URL, url.data());

    // Perform the request
    const auto res =  curl_easy_perform(handle.get());
    if (res != CURLE_OK)
    {
        curl_slist_free_all(headers);
        handleCurlError(handle, res);
    }

    curl_slist_free_all(headers);
    return output;
}

namespace
{
    namespace local
    {
        std::size_t
        getMatchesCallback(void* contents,
                           std::size_t size,
                           std::size_t nmemb,
                           void* userData)
        {
            std::size_t realSize = size * nmemb;

            // Contents isn't null terminated, and I don't want to rely on Json library there,
            // so just ensuring that the std::string never reads more than realSize number of characters.
            std::string jsonString(static_cast<char*>(contents), realSize);

            nlohmann::json var = nlohmann::json::parse(jsonString);
            std::vector<nlohmann::json>* output = static_cast<std::vector<nlohmann::json>*>(userData);

            for (const auto& item : var)
                output->push_back(item);

            return size * nmemb;
        };
    }
}

std::vector<nlohmann::json>
kjapp::getMatches(const std::string& gameToken,
                  kjapp::Query query,
                  const std::string& name)
{
    auto handle = createCurlHandle();
    curl_easy_setopt(handle.get(), CURLOPT_WRITEFUNCTION, local::getMatchesCallback);

    std::vector<nlohmann::json> output;
    curl_easy_setopt(handle.get(), CURLOPT_WRITEDATA, &output);

    std::string url = KJAPP_URL + "/matches/";

    switch(query)
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
            std::fprintf(stderr, "Query::BY_NAME is not supported yet!\n");
            url += "with_name/no_body/" + gameToken + "/" + name;
            return {};
        break;

        case Query::NOT_IN_SESSION:
            std::fprintf(stderr, "Query::NOT_IN_SESSION is not supported yet!\n");
            return {};
        break;

        default:
            std::fprintf(stderr, "Query is not supported yet\n");
            return {};
        break;
    }

    curl_easy_setopt(handle.get(), CURLOPT_URL, url.c_str());

    const auto res =  curl_easy_perform(handle.get());
    if (res != CURLE_OK)
        handleCurlError(handle, res);

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
    auto jsonString = json.dump();

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
    auto jsonString = json.dump();

    executeCurlRequest("PUT",
                       KJAPP_URL + "/match/player_count",
                       json.dump());
}
