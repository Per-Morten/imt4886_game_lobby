#include "chat_client.h"
#include <stdexcept>
#include <string>
#include <iostream>

ChatClient::ChatClient(const char* hostname, 
                       std::uint16_t port)
{
    IPaddress serverIP;
    if (SDLNet_ResolveHost(&serverIP, hostname, port) == -1)
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

    run();
}

ChatClient::~ChatClient()
{
    SDLNet_FreeSocketSet(m_socketSet);
    SDLNet_TCP_Close(m_socket);
}

void
ChatClient::run()
{
    std::atomic<bool> messageReady = false;
    std::atomic<bool> running = true;
    std::string input;
    std::thread typingThread([&messageReady, &running, &input]
    {
        do
        {
            printf("Message: ");
            std::getline(std::cin, input);
            messageReady = true;
            if (input == "shutdown")
            {
                running = false;
            }
            std::this_thread::sleep_for(std::chrono::seconds(1));
        } while (running);
    });

    char buffer[512];
    while (running)
    {
        if (SDLNet_CheckSockets(m_socketSet, 0) > 0 && SDLNet_SocketReady(m_socket))
        {
            int bytesRead = SDLNet_TCP_Recv(m_socket, buffer, 512);
            if (bytesRead <= 0)
            {
                running = false;
                std::printf("Disconnected\n");
            }
            std::printf("Received: %s\n", buffer);
        }
        if (messageReady)
        {
            std::printf("Sending: %s\n", input.data());
            SDLNet_TCP_Send(m_socket, input.data(), input.size() + 1);
            messageReady = false;
        }
    }

    typingThread.join();
}
