#pragma once
#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>

#include "scene.h"
#include "json.hpp"

class ChatServer
    : public Scene
{
public:
    ChatServer() = delete;

    ChatServer(SDL_Window* window,
               SDL_Renderer* renderer,
               const std::string& name,
               std::uint16_t port,
               std::size_t maxClients);

    virtual ~ChatServer();

    virtual
    SceneResult
    run() override;

private:
    struct ClientSocket
    {
        TCPsocket socket{};
        bool toBeDeleted{false};
    };

    // Regular update of chat, i.e, receive messages and send them around
    void handleChat();

    // Handle possible new connections
    void checkForNewConnections();
    void removeDisconnectedClients();

    void broadcastMessage(const char* message);

    constexpr static int BUFFER_LEN = 512;

    TCPsocket m_socket{};
    SDLNet_SocketSet m_socketSet{};

    std::vector<ClientSocket> m_clients{};
    const std::size_t m_maxClients{};

    nlohmann::json m_match{};
};
