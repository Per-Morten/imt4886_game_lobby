#pragma once
#include <atomic>
#include <cstddef>
#include <cstdint>
#include <thread>
#include <SDL_net.h>

class ChatClient
{
public:
    ChatClient(const char* hostname,
               std::uint16_t port);

    ~ChatClient();

private:
    void run();

    TCPsocket m_socket{};
    SDLNet_SocketSet m_socketSet{};
};
