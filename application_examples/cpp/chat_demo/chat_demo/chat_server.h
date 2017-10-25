#pragma once
#include <atomic>
#include <cstddef>
#include <cstdint>
#include <thread>
#include <vector>
#include <SDL2/SDL_net.h>

class ChatServer
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
    ChatServer(std::uint16_t port,
               std::size_t maxClients,
               std::atomic<bool>& running);

    /////////////////////////////////////////////////////////////////
    /// \brief
    ///     Closes the chat server and frees any memory.
    /////////////////////////////////////////////////////////////////
    ~ChatServer();

private:
    struct ClientSocket
    {
        TCPsocket socket{};
        bool toBeDeleted{false};
    };

    // Main thread executable function
    void run();

    // Regular update of chat, i.e, receive messages and send them around
    void handleChat();

    // Handle possible new connections
    void checkForNewConnections();
    void removeDisconnectedClients();

    // Sender of nullptr means that it should be sent to everyone
    void broadcastMessage(const char* message, TCPsocket sender);

    constexpr static int BUFFER_LEN = 512;

    std::atomic<bool>& m_running;

    TCPsocket m_socket{};
    SDLNet_SocketSet m_socketSet{};

    std::vector<ClientSocket> m_clients{};
    const std::size_t m_maxClients{};

};
