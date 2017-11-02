#include "scene.h"

class ChatMenu
    : public Scene
{
public:
    ChatMenu(SDL_Window* window,
             SDL_Renderer* renderer);

    virtual ~ChatMenu() {};

    virtual
    SceneResult
    run() override;

private:
    void
    drawButtons();

    void
    handleEvents();

    SDL_Rect m_hostButton{};
    SDL_Rect m_joinButton{};

};
