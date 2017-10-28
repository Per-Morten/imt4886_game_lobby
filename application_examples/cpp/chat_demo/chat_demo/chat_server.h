#pragma once
#include <atomic>
#include <cstddef>
#include <cstdint>
#include <thread>
#include <vector>
#include <SDL2/SDL_net.h>
#include "scene.h"

class ChatServer
    : public Scene
{
public:
    ChatServer() = delete;

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Starts a chat on specified port, which can serve up to
    ///     maxClients number of people.
    ///
    /// \detail
    ///     The ChatServer will try to create a socket that will
    ///     accept connections on the specified port.
    ///     The server will start running once created,
    ///     and stops running in the destructor.
    ///
    /// \param port
    ///     The port used to accept connections.
    ///
    /// \param maxClients
    ///     The maximum number of participants that can
    ///     partake in a chat.
    ///
    /// \throws runtime_error
    ///     If no sockets could be opened or the serverIP could
    ///     be resolved, the constructor will throw a
    ///     std::runtime_error.
    /////////////////////////////////////////////////////////////////
    ChatServer(SDL_Window* window,
               SDL_Renderer* renderer,
               const std::string& name,
               std::uint16_t port,
               std::size_t maxClients);

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Closes the chat server and frees any memory.
    /////////////////////////////////////////////////////////////////
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
};
