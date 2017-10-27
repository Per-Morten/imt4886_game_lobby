#include <algorithm>
#include <atomic>
#include <cinttypes>
#include <cstdio>
#include <iostream>
#include <string>
#include <thread>

#include <SDL2/SDL_net.h>

#include "chat_server.h"
#include "chat_client.h"

#include "kjapp.h"

// Turn off warning on strcpy
#ifdef _MSC_VER
#pragma warning(push)
#pragma warning(disable : 4996)
#endif

#undef main
constexpr Uint16 PORT = 8880;
constexpr int BUFFER_LEN = 512;

constexpr auto gameToken = "59ec8be7890cd692461bb7d4";

int
main(int argc, char** argv)
{
    if (SDL_Init(SDL_INIT_EVERYTHING) != 0)
    {
        std::printf("SDL initialization failed: %s\n", SDL_GetError());
        return 1;
    }
    if (SDLNet_Init() != 0)
    {
        std::printf("SDLNet initialization failed: %s\n", SDLNet_GetError());
        return 1;
    }

    std::printf("Arguments: %d %s\n", argc, argv[1]);

    if (argc > 1 && strcmp(argv[1], "-s") == 0)
    {
        std::printf("Running server\n");
        std::fflush(stdout);
        auto matchInfo = kjapp::hostMatch(gameToken,
                                          "Demo match",
                                          "127.0.0.1",
                                          8000,
                                          10);
        std::printf("MatchInfo: %s\n", matchInfo.dump().c_str());
        std::atomic<bool> running{true};
        std::thread thread([&running]
        {
            ChatServer chat(8000, 10, running);
        });

        std::printf("Write something to stop\n");
        std::getc(stdin);
        running = false;
        thread.join();
    }
    else
    {
        std::printf("Running client\n");
        std::fflush(stdout);
//        auto matches = kjapp::getMatches(gameToken, kjapp::Query::NON_FULL_MATCHES, "Demo");
//        for (std::size_t i = 0; i < matches.size(); ++i)
//        {
//            std::printf("Match %zu: name: %s id: %s\n", i,
//                        matches[i]["name"].get<std::string>().c_str(),
//                        matches[i]["_id"].get<std::string>().c_str());
//        }
//
//        std::printf("Write your choice\n");
//        int choice;
//        std::scanf("%d", &choice);

        try
        {
            //ChatClient(matches[choice]["hostIP"].get<std::string>().c_str(),
            //           matches[choice]["hostPort"].get<std::uint16_t>());
            ChatClient("127.0.0.1",
                       8000);
        }
        catch (const std::exception& e)
        {
            std::printf("Error: %s\n", e.what());
        }
    }

    SDLNet_Quit();
    SDL_Quit();

    return 0;
}

#ifdef _MSC_VER
#pragma warning(pop)
#endif
