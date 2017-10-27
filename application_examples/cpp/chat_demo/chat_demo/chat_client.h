#pragma once
#include <atomic>
#include <cstddef>
#include <cstdint>
#include <thread>
#include <SDL2/SDL_net.h>
#include <SDL2/SDL_ttf.h>

class ChatClient
{
public:
    ChatClient(const char* ipAddress,
               std::uint16_t port);

    ~ChatClient();

private:
    void run();

    void setupSDL();
    //void displayText(const char* message);
    void handleEvents(std::atomic<bool>& running);

    TCPsocket m_socket{};
    SDLNet_SocketSet m_socketSet{};

    // Input handling
    std::string m_message{};
    bool m_messageReady{false};

    // Graphics stuff
    SDL_Window* m_window;
    SDL_Renderer* m_renderer;

    TTF_Font* m_font;
};
