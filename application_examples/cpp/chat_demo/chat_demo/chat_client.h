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
               const char* ipAddress,
               std::uint16_t port);

    virtual ~ChatClient();

    virtual
    SceneResult
    run() override;

private:
    void handleEvents();
    void drawText();
    void handleText();

    static constexpr std::size_t DISPLAY_LIMIT = 10;

    // Network stuff
    TCPsocket m_socket{};
    SDLNet_SocketSet m_socketSet{};

    // Input handling
    std::string m_message{};
    bool m_messageReady{false};

    std::vector<std::string> m_receivedMessages{};
};
