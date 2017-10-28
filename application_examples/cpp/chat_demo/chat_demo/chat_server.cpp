#include "chat_server.h"

#include <algorithm>
#include <cstdio>
#include <cstring>
#include <stdexcept>

#include "kjapp.h"

ChatServer::ChatServer(SDL_Window* window,
                       SDL_Renderer* renderer,
                       const std::string& name,
                       std::uint16_t port,
                       std::size_t maxClients)
    : Scene(window, renderer)
    , m_maxClients(maxClients)
{
    IPaddress serverIP;
    if (SDLNet_ResolveHost(&serverIP, nullptr, port) == -1)
        throw std::runtime_error(SDLNet_GetError());

    m_socket = SDLNet_TCP_Open(&serverIP);
    if (!m_socket)
        throw std::runtime_error(SDLNet_GetError());

    // +1 here because the serverSocket is part of the set
    m_socketSet = SDLNet_AllocSocketSet(m_maxClients + 1);
    if (!m_socketSet)
    {
        // Avoid leaking a socket if we cannot allocate a set
        SDLNet_TCP_Close(m_socket);
        throw std::runtime_error(SDLNet_GetError());
    }

    SDLNet_TCP_AddSocket(m_socketSet, m_socket);

    try
    {
        auto myIp = kjapp::getMyIP();
        kjapp::hostMatch(GAME_TOKEN,
                         name,
                         myIp,
                         port,
                         maxClients);

        char buffer[128];
        std::sprintf(buffer, "Running server on: %s", myIp.c_str());

        broadcastMessage(buffer);
    }
    catch (const std::exception& e)
    {
        SDLNet_FreeSocketSet(m_socketSet);
        SDLNet_TCP_Close(m_socket);
        throw e;
    }
}

ChatServer::~ChatServer()
{
    SDLNet_FreeSocketSet(m_socketSet);
    SDLNet_TCP_Close(m_socket);
}

SceneResult
ChatServer::run()
{
    while (m_running)
    {
        SDL_RenderClear(m_renderer);
        SDL_Event event;
        while (SDL_PollEvent(&event))
        {
            Scene::handleEvent(event);
        }

        int activity = SDLNet_CheckSockets(m_socketSet, 1);
        if (activity)
        {
            checkForNewConnections();
            handleChat();
            removeDisconnectedClients();
        }

        displayScroller();
        SDL_RenderPresent(m_renderer);
    }

    return {m_continueProgram, nullptr};
}

void
ChatServer::handleChat()
{
    for (auto& client : m_clients)
    {
        if (SDLNet_SocketReady(client.socket))
        {
            char buffer[BUFFER_LEN];
            int bytesReceived = SDLNet_TCP_Recv(client.socket, buffer, BUFFER_LEN);

            // If the client is disconnecting
            if (bytesReceived == 0)
            {
                client.toBeDeleted = true;
            }
            else
            {
                // Turning it into string here to ensure that we get null termination
                std::string message(buffer, bytesReceived);
                broadcastMessage(message.c_str());
            }
        }
    }
}

void
ChatServer::checkForNewConnections()
{
    int serverActivity = SDLNet_SocketReady(m_socket);

    // Someone is trying to connect
    if (serverActivity)
    {
        if (m_clients.size() < m_maxClients)
        {
            m_clients.push_back({});
            m_clients.back().socket = SDLNet_TCP_Accept(m_socket);
            SDLNet_TCP_AddSocket(m_socketSet, m_clients.back().socket);
            broadcastMessage("New client has connected");
        }
        else
        {
            TCPsocket tmp = SDLNet_TCP_Accept(m_socket);
            const auto msg = "Server is full";
            SDLNet_TCP_Send(tmp, msg, std::strlen(msg) + 1);
            SDLNet_TCP_Close(tmp);
        }
    }
}

void
ChatServer::removeDisconnectedClients()
{
    for (auto& client : m_clients)
    {
        if (client.toBeDeleted)
        {
            SDLNet_TCP_DelSocket(m_socketSet, client.socket);
            SDLNet_TCP_Close(client.socket);
        }
    }

    m_clients.erase(std::remove_if(std::begin(m_clients),
                                   std::end(m_clients),
                                   [](const auto& item)
                                   { return item.toBeDeleted; }),
                    std::end(m_clients));
}

void
ChatServer::broadcastMessage(const char* message)
{
    const int msgLength = std::strlen(message) + 1;

    // No need to send empty message
    if (msgLength == 1)
    {
        return;
    }

    for (auto& client : m_clients)
    {
        // Send to everyone, easier to have a two window part system
        if (!client.toBeDeleted)
        {
            SDLNet_TCP_Send(client.socket, message, msgLength);
        }
    }

    addTextToScroller(message);
}

