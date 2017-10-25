#include "chat_client.h"
#include <stdexcept>
#include <string>
#include <iostream>
#include <cstring>

ChatClient::ChatClient(const char* ipAddress,
                       std::uint16_t port)
{
    IPaddress serverIP;
    if (SDLNet_ResolveHost(&serverIP, ipAddress, port) == -1)
        throw std::runtime_error(SDLNet_GetError());

    m_socket = SDLNet_TCP_Open(&serverIP);
    if (!m_socket)
        throw std::runtime_error(SDLNet_GetError());

    m_socketSet = SDLNet_AllocSocketSet(1);

    if (!m_socketSet)
    {
        // Avoid leaking a socket if we cannot allocate a set
        SDLNet_TCP_Close(m_socket);
        throw std::runtime_error(SDLNet_GetError());
    }

    SDLNet_TCP_AddSocket(m_socketSet, m_socket);

    setupSDL();

    run();
}

ChatClient::~ChatClient()
{
    SDLNet_FreeSocketSet(m_socketSet);
    SDLNet_TCP_Close(m_socket);
    SDL_DestroyRenderer(m_renderer);
    SDL_DestroyWindow(m_window);
}

//TTF_Font* Sans = TTF_OpenFont("Sans.ttf", 24); //this opens a font style and sets a size
//
//SDL_Color White = {255, 255, 255};  // this is the color in rgb format, maxing out all would give you the color white, and it will be your text's color
//
//SDL_Surface* surfaceMessage = TTF_RenderText_Solid(Sans, "put your text here", White); // as TTF_RenderText_Solid could only be used on SDL_Surface then you have to create the surface first
//
//SDL_Texture* Message = SDL_CreateTextureFromSurface(renderer, surfaceMessage); //now you can convert it into a texture
//
//SDL_Rect Message_rect; //create a rect
//Message_rect.x = 0;  //controls the rect's x coordinate
//Message_rect.y = 0; // controls the rect's y coordinte
//Message_rect.w = 100; // controls the width of the rect
//Message_rect.h = 100; // controls the height of the rect
//
////Mind you that (0,0) is on the top left of the window/screen, think a rect as the text's box, that way it would be very simple to understance
//
////Now since it's a texture, you have to put RenderCopy in your game loop area, the area where the whole code executes
//
//SDL_RenderCopy(renderer, Message, NULL, &Message_rect); //you put the renderer's name first, the Message, the crop size(you can ignore this if you don't want to dabble with cropping), and the rect which is the size and coordinate of your texture
//
////Don't forget too free your surface and texture

void
ChatClient::setupSDL()
{
    m_window = SDL_CreateWindow("chat",
                                SDL_WINDOWPOS_UNDEFINED,
                                SDL_WINDOWPOS_UNDEFINED,
                                800,
                                640,
                                SDL_WINDOW_SHOWN);
    if (!m_window)
        std::printf("Could not create window\n");

    m_renderer = SDL_CreateRenderer(m_window, -1, SDL_RENDERER_ACCELERATED);
    if (!m_renderer)
        std::printf("Could not create renderer\n");

    m_font = TTF_OpenFont("Sans.ttf", 24);
    if (!m_font)
        std::printf("Could not create font\n");

    SDL_Color clearColor = {128,128,128,255};

    SDL_SetRenderDrawColor(m_renderer,
                           clearColor.r,
                           clearColor.g,
                           clearColor.b,
                           clearColor.a);
    std::printf("Set renderer draw color\n");

}

void
ChatClient::displayText(const char* msg)
{
    SDL_Color white = {255, 255, 255, 255};
    SDL_Surface* surface = TTF_RenderText_Solid(m_font, msg, white);
    SDL_Texture* message = SDL_CreateTextureFromSurface(m_renderer, surface);

    SDL_Rect messageRect;
    messageRect.x = 0;
    messageRect.y = 0;
    messageRect.w = 100;
    messageRect.h = 100;

    SDL_RenderCopy(m_renderer, message, nullptr, &messageRect);

    SDL_FreeSurface(surface);
    SDL_DestroyTexture(message);
}

void
ChatClient::handleEvents(std::atomic<bool>& running)
{
    SDL_Event event;
    while (SDL_PollEvent(&event))
    {
        if (event.type == SDL_QUIT ||
            (event.type == SDL_KEYUP &&
             event.key.keysym.sym == SDLK_ESCAPE))
        {
            running = false;
        }
    }
}


void
ChatClient::run()
{
    std::atomic<bool> messageReady{false};
    std::atomic<bool> running{true};
    std::string input;

    std::thread typingThread([&messageReady, &running, &input]
    {
        do
        {
            printf("Message: ");
            fflush(stdout);
            std::getline(std::cin, input);
            messageReady = true;
            if (input == "shutdown" ||
                input == "disconnect")
            {
                running = false;
            }
            std::this_thread::sleep_for(std::chrono::seconds(0));
        } while (running);
    });

    char buffer[512];
    while (running)
    {
        SDL_RenderClear(m_renderer);
        handleEvents(running);
        if (SDLNet_CheckSockets(m_socketSet, 0) > 0 && SDLNet_SocketReady(m_socket))
        {
            int bytesRead = SDLNet_TCP_Recv(m_socket, buffer, 512);
            if (bytesRead <= 0)
            {
                running = false;
                std::printf("Disconnected\n");
            }
            std::printf("Received: %s\n", buffer);
            displayText(buffer);
        }
        if (messageReady)
        {
            std::printf("Sending: %s\n", input.data());
            SDLNet_TCP_Send(m_socket, input.data(), input.size() + 1);
            messageReady = false;
        }



        SDL_RenderPresent(m_renderer);
    }

    typingThread.join();
}
