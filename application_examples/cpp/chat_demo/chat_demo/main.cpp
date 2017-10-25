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
                                          8880,
                                          10);
        std::printf("MatchInfo: %s\n", matchInfo.dump().c_str());
        //ChatServer chat(8880, 10);
    }
    else
    {
        std::printf("Running client\n");
        std::fflush(stdout);
        //ChatClient("localhost", 8880);
    }

    SDLNet_Quit();
    SDL_Quit();

    return 0;
}

#ifdef _MSC_VER
#pragma warning(pop)
#endif
