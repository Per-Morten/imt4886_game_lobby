#pragma once
#include <memory>
#include <string>
#include <utility>
#include <vector>

#include <SDL2/SDL_net.h>
#include <SDL2/SDL_ttf.h>

class Scene;
using SceneResult = std::pair<bool, std::unique_ptr<Scene>>;

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
    drawButton(const SDL_Rect& button,
               const SDL_Color& color);

    void
    addTextToScroller(const std::string& str);

    void
    handleEvent(const SDL_Event& event);

    bool
    isClicked(const SDL_Rect& button,
              const int xPos,
              const int yPos);

    static constexpr int FONT_HEIGHT = 18;
    static constexpr std::size_t DISPLAY_LIMIT = 10;
    static constexpr auto GAME_TOKEN = "59ec8be7890cd692461bb7d4";

    SDL_Window* m_window;
    SDL_Renderer* m_renderer;

    TTF_Font* m_font{};

    std::vector<std::string> m_scrollerStrings{};

    bool m_running{true};
    bool m_continueProgram{true};
};
