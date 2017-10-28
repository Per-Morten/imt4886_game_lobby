#include <algorithm>
#include <atomic>
#include <cinttypes>
#include <cstdio>
#include <iostream>
#include <string>
#include <thread>
#include <stack>

#include <SDL2/SDL_net.h>

#include "chat_server.h"
#include "chat_client.h"
#include "chat_menu.h"

#include "kjapp.h"
#include "scene.h"

// Turn off warning on strcpy
#ifdef _MSC_VER
#pragma warning(push)
#pragma warning(disable : 4996)
#endif

#undef main
constexpr Uint16 PORT = 8880;
constexpr int BUFFER_LEN = 512;

constexpr auto gameToken = "59ec8be7890cd692461bb7d4";

// void
// runServer()
// {
//     std::printf("Running server\n");
//     std::fflush(stdout);
//     auto matchInfo = kjapp::hostMatch(gameToken,
//                                       "Demo match",
//                                       "127.0.0.1",
//                                       8000,
//                                       10);
//     std::printf("MatchInfo: %s\n", matchInfo.dump().c_str());
//     std::atomic<bool> running{true};
//     std::thread thread([&running]
//     {
//         ChatServer chat(8000, 10, running);
//     });

//     std::printf("Write something to stop\n");
//     std::getc(stdin);
//     running = false;
//     thread.join();
// }

using WindowRenderer = std::pair<SDL_Window*, SDL_Renderer*>;

WindowRenderer
setupSDL(int width,
         int height,
         const char* windowText)
{
    if (SDL_Init(SDL_INIT_EVERYTHING) != 0)
        throw std::runtime_error(SDL_GetError());

    if (SDLNet_Init() != 0)
        throw std::runtime_error(SDLNet_GetError());

    auto window = SDL_CreateWindow(windowText,
                                   SDL_WINDOWPOS_UNDEFINED,
                                   SDL_WINDOWPOS_UNDEFINED,
                                   width,
                                   height,
                                   SDL_WINDOW_SHOWN);

    if (!window)
        throw std::runtime_error(SDL_GetError());

    auto renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);

    if (!renderer)
    {
        SDL_DestroyWindow(window);
        throw std::runtime_error(SDL_GetError());
    }

    SDL_Color clearColor = {128, 128, 128, 255};

    SDL_SetRenderDrawColor(renderer,
                           clearColor.r,
                           clearColor.g,
                           clearColor.b,
                           clearColor.a);

    SDL_StartTextInput();

    return {window, renderer};
}

int
main(int argc, char** argv)
{
    auto windowAndRenderer = setupSDL(1280, 720, "Chat");

    std::printf("Arguments: %d %s\n", argc, argv[1]);

    std::stack<std::unique_ptr<Scene>> scenes;
//    if (argc > 1 && strcmp(argv[1], "-s") == 0)
//    {
//        auto ptr = std::make_unique<ChatServer>(windowAndRenderer.first,
//                                                windowAndRenderer.second,
//                                                8000, 10);
//        scenes.push(std::move(ptr));
//    }
//    else
//    {
//        auto ptr = std::make_unique<ChatClient>(windowAndRenderer.first,
//                                                windowAndRenderer.second,
//                                                "127.0.0.1",
//                                                8000);
//        scenes.push(std::move(ptr));
//    }

    auto ptr = std::make_unique<ChatMenu>(windowAndRenderer.first,
                                          windowAndRenderer.second);

    scenes.push(std::move(ptr));


    while (!scenes.empty())
    {
        auto result = scenes.top()->run();
        if (!result.first)
            break;

        if (result.second)
        {
            scenes.push(std::move(result.second));
        }
        else
        {
            scenes.pop();
        }
    }


//    if (argc > 1 && strcmp(argv[1], "-s") == 0)
//    {
//        runServer();
//    }
//    else
//    {
        //std::printf("Running client\n");
        //std::fflush(stdout);
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

        //try
        //{
        //    //ChatClient(matches[choice]["hostIP"].get<std::string>().c_str(),
        //    //           matches[choice]["hostPort"].get<std::uint16_t>());
        //    ChatClient(windowAndRenderer.first,
        //               windowAndRenderer.second,
        //               "127.0.0.1",
        //               8000);
        //}
        //catch (const std::exception& e)
        //{
        //    std::printf("Error: %s\n", e.what());
        //}
    //}

    SDL_StopTextInput();
    SDLNet_Quit();
    SDL_Quit();

    return 0;
}

#ifdef _MSC_VER
#pragma warning(pop)
#endif
