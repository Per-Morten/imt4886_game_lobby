#include <algorithm>
#include <cinttypes>
#include <cstdio>
#include <iostream>
#include <thread>
#include <atomic>
#include <string>

#include <SDL.h>
#include <SDL_net.h>

// Turn off warning on strcpy
#ifdef _MSC_VER
#pragma warning(push)
#pragma warning(disable : 4996)
#endif

#undef main
constexpr Uint16 PORT = 8880;
constexpr int BUFFER_LEN = 512;

void
runServer()
{
    IPaddress serverIP;
    if (SDLNet_ResolveHost(&serverIP, NULL, PORT) != 0)
    {
        std::printf("Could not resolve server host: %s\n", SDLNet_GetError());
        return;
    }

    // Print out resolved host
    std::printf("Resolved server host to be: %" PRIu32 ", i.e.: %" PRIu8 ".%" PRIu8 ".%" PRIu8 ".%" PRIu8 ":%" PRIu16 "\n",
                serverIP.host,
                reinterpret_cast<Uint8*>(&serverIP.host)[0],
                reinterpret_cast<Uint8*>(&serverIP.host)[1],
                reinterpret_cast<Uint8*>(&serverIP.host)[2],
                reinterpret_cast<Uint8*>(&serverIP.host)[3],
                serverIP.port);

    // Open server socket
    TCPsocket serverSocket = SDLNet_TCP_Open(&serverIP);
    if (!serverSocket)
    {
        std::printf("Failed to open server socket: %s\n", SDLNet_GetError());
        return;
    }
    std::printf("Server socket open\n");

    // Number of active connections we allow to the server
    constexpr int SOCKET_SET_SIZE = 10;
    SDLNet_SocketSet socketSet = SDLNet_AllocSocketSet(SOCKET_SET_SIZE);

    // Add our server to the socket set
    SDLNet_TCP_AddSocket(socketSet, serverSocket);

    // Max number of clients
    constexpr int MAX_CLIENTS = SOCKET_SET_SIZE - 1;

    struct ClientSocket
    {
        TCPsocket socket = NULL;
        bool isFree = true;
    };
    ClientSocket clients[MAX_CLIENTS];
    std::size_t clientCount = 0;


    bool running = true;
    while (running)
    {
        int numActiveSockets = SDLNet_CheckSockets(socketSet, 0);
        if (numActiveSockets != 0)
        {
            std::printf("Active Sockets: %d\n", numActiveSockets);
        }

        int serverSocketActivity = SDLNet_SocketReady(serverSocket);
        // Check if someone is trying to connect
        if (serverSocketActivity)
        {
            std::printf("Server socket activity\n");

            // Do this check with iterators instead or something?
            if (clientCount < MAX_CLIENTS)
            {
                auto firstFree = std::find_if(std::begin(clients),
                                              std::end(clients),
                                              [](const auto& item) { return item.isFree; });
                
                firstFree->isFree = false;
                firstFree->socket = SDLNet_TCP_Accept(serverSocket);
                SDLNet_TCP_AddSocket(socketSet, firstFree->socket);
                clientCount++;

                // Inform client that connection has been accepted
                char buffer[BUFFER_LEN];
                strcpy(buffer, "Connection successful");
                SDLNet_TCP_Send(firstFree->socket, buffer, strlen(buffer) + 1);
            }
            else
            {
                // Don't have room for any more
                std::printf("Rejecting client, chat is full\n");
                TCPsocket tmp = SDLNet_TCP_Accept(serverSocket);

                char buffer[BUFFER_LEN];
                strcpy(buffer, "Server is full");
                SDLNet_TCP_Send(tmp, buffer, strlen(buffer) + 1);
                SDLNet_TCP_Close(tmp);
            }
        }

        for (std::size_t i = 0; i < std::size(clients); ++i)
        {
            if (SDLNet_SocketReady(clients[i].socket))
            {
                std::printf("Activity\n");

                char buffer[BUFFER_LEN];
                int receivedCount = SDLNet_TCP_Recv(clients[i].socket, buffer, BUFFER_LEN);

                // Client has disconnected or there has been an error.
                if (receivedCount <= 0)
                {
                    std::printf("Client %zu disconnected.", i);
                    SDLNet_TCP_DelSocket(socketSet, clients[i].socket);
                    SDLNet_TCP_Close(clients[i].socket);
                    clients[i].socket = NULL;
                    clients[i].isFree = true;
                    clientCount--;
                }
                else
                {
                    std::printf("Received: %s, from client: %zu\n", buffer, i);
                    for (std::size_t j = 0; j < std::size(clients); ++j)
                    {
                        int msgLength = strlen(buffer) + 1;
                        // Echo message back for now, when echo off, add j != i to check
                        if (msgLength > 1 && clients[j].isFree == false)
                        {
                            std::printf("Sending message: %s (%d bytes) to client: %zu\n", buffer, msgLength, j);
                            SDLNet_TCP_Send(clients[j].socket, buffer, msgLength);
                        }
                    }

                    if (strcmp(buffer, "shutdown") == 0)
                    {
                        running = false;
                        std::printf("Disconnecting all clients, shutting down\n");
                    }
                }
            }
        }
    }

    // Cleanup
    SDLNet_FreeSocketSet(socketSet);
    SDLNet_TCP_Close(serverSocket);
}

void
runClient()
{
    IPaddress targetIP;
    if (SDLNet_ResolveHost(&targetIP, "localhost", PORT) != 0)
    {
        std::printf("Could not resolve server host: %s\n", SDLNet_GetError());
        return;
    }

    // Print out resolved host
    std::printf("Resolved target host to be: %" PRIu32 ", i.e.: %" PRIu8 ".%" PRIu8 ".%" PRIu8 ".%" PRIu8 ":%" PRIu16 "\n",
                targetIP.host,
                reinterpret_cast<Uint8*>(&targetIP.host)[0],
                reinterpret_cast<Uint8*>(&targetIP.host)[1],
                reinterpret_cast<Uint8*>(&targetIP.host)[2],
                reinterpret_cast<Uint8*>(&targetIP.host)[3],
                targetIP.port);

    // Open client socket
    TCPsocket client = SDLNet_TCP_Open(&targetIP);
    if (!client)
    {
        std::printf("Failed to open client socket: %s\n", SDLNet_GetError());
        return;
    }
    std::printf("Client socket open\n");
    SDLNet_SocketSet set = SDLNet_AllocSocketSet(1);
    SDLNet_TCP_AddSocket(set, client);

    std::atomic<bool> messageReady = false;
    std::atomic<bool> running = true;
    std::string input;
    std::thread typingThread([&messageReady, &running, &input]
    {
        do
        {
            printf("In loop\n");
            std::getline(std::cin, input);
            messageReady = true;
            if (input == "shutdown")
            {
                running = false;
            }
        } while (running);
    });

    char buffer[BUFFER_LEN];
    while (running)
    {
        if (SDLNet_CheckSockets(set, 0) > 0 && SDLNet_SocketReady(client))
        {
            int bytesRead = SDLNet_TCP_Recv(client, buffer, BUFFER_LEN);
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
            SDLNet_TCP_Send(client, input.data(), input.size() + 1);
            messageReady = false;
        }
    }

    typingThread.join();
    SDLNet_FreeSocketSet(set);
    SDLNet_TCP_Close(client);

    return;

    

}


int
main(int argc, char** argv)
{
    if (SDL_Init(SDL_INIT_EVERYTHING) != 0)
    {
        std::printf("SDL initialization failed: %s\n", SDL_GetError());
        return 1;
    }
    if (SDLNet_Init() != 0)
    {
        std::printf("SDLNet initialization failed: %s\n", SDLNet_GetError());
        return 1;
    }

    std::printf("Arguments: %d %s\n", argc, argv[1]);

    if (argc > 1 && strcmp(argv[1], "-s") == 0)
    {
        std::printf("Running client\n");
        std::fflush(stdout);
        runClient();
    }
    else
    {
        std::printf("Running server\n");
        std::fflush(stdout);
        runServer();
    }

    SDLNet_Quit();
    SDL_Quit();

    //system("pause");
    return 0;
}

#ifdef _MSC_VER
#pragma warning(pop)
#endif
