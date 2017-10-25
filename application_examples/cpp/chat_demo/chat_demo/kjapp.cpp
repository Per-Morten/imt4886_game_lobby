#include "kjapp.h"

#include <cinttypes>
#include <cstdio>
#include <cstring>
#include <memory>

#include <curl/curl.h>
#include "json.hpp"


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

    return CurlHandle(curl);
}

using json = nlohmann::json;

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
            *output = json(jsonString);
            return size * nmemb;
        };
    }
}

nlohmann::json
kjapp::hostMatch(const std::string& gameToken,
                 const std::string& name,
                 const std::string& hostIP,
                 const std::uint16_t hostPort,
                 const std::size_t maxPlayerCount)
{
    return hostMatch(gameToken, name, hostIP, hostPort, maxPlayerCount, " ");
}

nlohmann::json
kjapp::hostMatch(const std::string& gameToken,
                 const std::string& name,
                 const std::string& hostIP,
                 const std::uint16_t hostPort,
                 const std::size_t maxPlayerCount,
                 const nlohmann::json& miscInfo)
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
        throw std::runtime_error(curl_easy_strerror(res));
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
    }

    curl_easy_setopt(handle.get(), CURLOPT_URL, url.c_str());

    const auto res =  curl_easy_perform(handle.get());
    if (res != CURLE_OK)
    {
        throw std::runtime_error(curl_easy_strerror(res));
    }

    return output;
}
