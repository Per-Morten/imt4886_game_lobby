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
    void displayText(const std::string& str, int yPos);
    void handleEvents();


    // Network stuff
    TCPsocket m_socket{};
    SDLNet_SocketSet m_socketSet{};
    bool m_running{true};

    // Input handling
    std::string m_message{};
    bool m_messageReady{false};

    // Graphics stuff
    static constexpr int FONT_HEIGHT = 18;
    static constexpr std::size_t DISPLAY_LIMIT = 10;

    SDL_Window* m_window{};
    SDL_Renderer* m_renderer{};

    TTF_Font* m_font{};
};
