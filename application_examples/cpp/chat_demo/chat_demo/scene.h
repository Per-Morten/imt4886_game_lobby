#pragma once
#include <SDL2/SDL_net.h>
#include <SDL2/SDL_ttf.h>
#include <string>
#include <memory>
#include <vector>
#include <functional>

class Scene;
using SceneResult = std::pair<bool, std::unique_ptr<Scene>>;

using EventHandler = std::function<void(const SDL_Event& event)>;

class Scene
{
public:
    Scene(SDL_Window* window,
          SDL_Renderer* renderer);

    virtual
    ~Scene();

    virtual
    SceneResult
    run() = 0;

protected:
    void
    displayText(const std::string& str,
                int xPos, int yPos);

    void
    displayScroller();

    void
    addTextToScroller(const std::string& str);

    void
    handleEvent(const SDL_Event& event);

    static constexpr int FONT_HEIGHT = 18;
    static constexpr std::size_t DISPLAY_LIMIT = 10;

    SDL_Window* m_window;
    SDL_Renderer* m_renderer;

    TTF_Font* m_font{};

    std::vector<std::string> m_scrollerStrings{};
    std::vector<EventHandler> m_eventHandlers{};

    bool m_running{true};
    bool m_continueProgram{true};
};

// Predeclarations
class ChatMenu;
class ChatClient;
class ChatServer;
class ChatRoomLister;
class UserNameEntry;
