#include "chat_client.h"
#include <stdexcept>
#include <string>
#include <iostream>
#include <cstring>
#include <vector>

ChatClient::ChatClient(SDL_Window* window,
                       SDL_Renderer* renderer,
                       const char* ipAddress,
                       std::uint16_t port)
    : Scene(window, renderer)
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

}

ChatClient::~ChatClient()
{
    SDLNet_FreeSocketSet(m_socketSet);
    SDLNet_TCP_Close(m_socket);
}

SceneResult
ChatClient::run()
{
    while (handleEvents())
    {
        SDL_RenderClear(m_renderer);
        handleText();
        drawText();
        SDL_RenderPresent(m_renderer);
    }

    return {false, nullptr};
}

bool
ChatClient::handleEvents()
{
    SDL_Event event;
    while (SDL_PollEvent(&event))
    {
        if (event.type == SDL_QUIT ||
            (event.type == SDL_KEYUP &&
             event.key.keysym.sym == SDLK_ESCAPE))
        {
            return false;
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

    return true;
}

void
ChatClient::drawText()
{
    // Display Received Text
    displayScroller();

    int height;
    SDL_GetWindowSize(m_window, nullptr, &height);
    std::string display = "Msg: " + m_message;
    displayText(display, 0, height - FONT_HEIGHT);

}

void
ChatClient::handleText()
{
    if (SDLNet_CheckSockets(m_socketSet, 0) > 0 && SDLNet_SocketReady(m_socket))
    {
        char buffer[512];
        int bytesRead = SDLNet_TCP_Recv(m_socket, buffer, 512);
        addTextToScroller(buffer);
        //if (m_receivedMessages.size() > DISPLAY_LIMIT)
        //{
        //    // Ugly way of popping front
        //    m_receivedMessages.erase(m_receivedMessages.begin());
        //}
        //m_receivedMessages.push_back({buffer});
    }
    if (m_messageReady)
    {
        //std::printf("Sending: %s\n", m_message.data());
        SDLNet_TCP_Send(m_socket, m_message.data(), m_message.size() + 1);
        m_message.clear();
        m_messageReady = false;
    }
}
