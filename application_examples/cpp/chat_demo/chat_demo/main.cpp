#include <string>
#include <stack>

#include <SDL2/SDL.h>
#include <SDL2/SDL_net.h>
#include <stdexcept>

#include "scene.h"
#include "chat_menu.h"

#include "kjapp.h"

#undef main

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
main(int argc,
     char** argv)
{
    auto windowAndRenderer = setupSDL(1280, 720, "Chat");

    std::stack<std::unique_ptr<Scene>> scenes;

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

    SDL_StopTextInput();
    SDLNet_Quit();
    SDL_Quit();

    return 0;
}
