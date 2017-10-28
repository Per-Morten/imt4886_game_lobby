#pragma once
#include <atomic>
#include <cstddef>
#include <cstdint>
#include <thread>
#include <vector>
#include <SDL2/SDL_net.h>
#include <SDL2/SDL_ttf.h>
#include "scene.h"


class ChatClient
    : public Scene
{
public:
    ChatClient(SDL_Window* window,
               SDL_Renderer* renderer,
               const std::string& ipAddress,
               std::uint16_t port,
               const std::string& userName);

    virtual ~ChatClient();

    virtual
    SceneResult
    run() override;

private:
    void handleEvents();
    void drawText();
    void handleText();

    // Network stuff
    TCPsocket m_socket{};
    SDLNet_SocketSet m_socketSet{};

    // Input handling
    std::string m_message{};
    std::string m_username{};
    bool m_messageReady{false};

    std::vector<std::string> m_receivedMessages{};
};
