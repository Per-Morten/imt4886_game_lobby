#include "chat_client.h"
#include <stdexcept>
#include <string>
#include <iostream>
#include <cstring>
#include <vector>

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
    SDL_StopTextInput();
    SDLNet_FreeSocketSet(m_socketSet);
    SDLNet_TCP_Close(m_socket);
    SDL_DestroyRenderer(m_renderer);
    SDL_DestroyWindow(m_window);

    TTF_Quit();
}

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

    if (TTF_Init() < 0)
        std::printf("Could not initialize TTF");

    m_font = TTF_OpenFont("Menlo-Regular.ttf", FONT_HEIGHT);
    if (!m_font)
        std::printf("Could not create font\n");

    SDL_Color clearColor = {128,128,128,255};

    SDL_SetRenderDrawColor(m_renderer,
                           clearColor.r,
                           clearColor.g,
                           clearColor.b,
                           clearColor.a);
    std::printf("Set renderer draw color\n");

    SDL_StartTextInput();

}

void
ChatClient::displayText(const std::string& str,
                        const int yPos)
{
    SDL_Color white = {255, 255, 255, 255};
    SDL_Surface* surface = TTF_RenderText_Solid(m_font,
                                                str.c_str(),
                                                white);

    SDL_Texture* message = SDL_CreateTextureFromSurface(m_renderer,
                                                        surface);

    SDL_Rect messageRect;
    messageRect.x = 0;
    messageRect.y = yPos;
    messageRect.w = str.size() * FONT_HEIGHT;
    messageRect.h = FONT_HEIGHT;

    SDL_RenderCopy(m_renderer, message, nullptr, &messageRect);

    SDL_FreeSurface(surface);
    SDL_DestroyTexture(message);
}

void
ChatClient::handleEvents()
{
    SDL_Event event;
    while (SDL_PollEvent(&event))
    {
        if (event.type == SDL_QUIT ||
            (event.type == SDL_KEYUP &&
             event.key.keysym.sym == SDLK_ESCAPE))
        {
            m_running = false;
        }

        if (event.type == SDL_KEYUP)
        {
            if (event.key.keysym.sym == SDLK_RETURN)
            {
                m_messageReady = true;
            }
            else if (event.key.keysym.sym == SDLK_BACKSPACE &&
                     !m_message.empty())
            {
                m_message.pop_back();
            }
        }

        if (event.type == SDL_TEXTINPUT)
        {
            m_message.push_back(event.text.text[0]);
        }
    }
}


void
ChatClient::run()
{
    std::vector<std::string> receivedMessages;

    char buffer[512];
    while (m_running)
    {
        handleEvents();
        SDL_RenderClear(m_renderer);

        // Display Received Text
        displayText("Received: ", 0);
        for (std::size_t i = 0; i < receivedMessages.size(); ++i)
        {
            displayText(receivedMessages[i], (i + 1) * FONT_HEIGHT);
        }

        // Display Writing Text
        {
            int height;
            SDL_GetWindowSize(m_window, nullptr, &height);
            std::string display = "Msg: " + m_message;
            displayText(display, height - FONT_HEIGHT);
        }

        if (SDLNet_CheckSockets(m_socketSet, 0) > 0 && SDLNet_SocketReady(m_socket))
        {
            int bytesRead = SDLNet_TCP_Recv(m_socket, buffer, 512);
            if (bytesRead <= 0)
            {
                m_running = false;
                std::printf("Disconnected\n");
            }
            std::printf("Received: %s\n", buffer);
            if (receivedMessages.size() > 10)
            {
                // Ugly way of popping front
                receivedMessages.erase(receivedMessages.begin());
            }
            receivedMessages.push_back({buffer});
        }
        if (m_messageReady)
        {
            std::printf("Sending: %s\n", m_message.data());
            SDLNet_TCP_Send(m_socket, m_message.data(), m_message.size() + 1);
            m_message.clear();
            m_messageReady = false;
        }

        SDL_RenderPresent(m_renderer);
    }
}
