#include "scene.h"
#include <stdexcept>

Scene::Scene(SDL_Window* window,
             SDL_Renderer* renderer)
    : m_window(window)
    , m_renderer(renderer)
{
    if (TTF_Init() < 0)
        throw std::runtime_error(TTF_GetError());

    m_font = TTF_OpenFont("Menlo-Regular.ttf", FONT_HEIGHT);

    if (!m_font)
    {
        TTF_Quit();
        throw std::runtime_error(TTF_GetError());
    }
    SDL_StartTextInput();
}

Scene::~Scene()
{
    TTF_CloseFont(m_font);
    TTF_Quit();
}

void
Scene::displayText(const std::string& str,
                   const int xPos, const int yPos)
{
    SDL_Color white = {255, 255, 255, 255};
    SDL_Surface* surface = TTF_RenderText_Solid(m_font,
                                                str.c_str(),
                                                white);

    SDL_Texture* message = SDL_CreateTextureFromSurface(m_renderer,
                                                        surface);

    SDL_Rect messageRect;
    messageRect.x = xPos;
    messageRect.y = yPos;
    messageRect.w = str.size() * FONT_HEIGHT;
    messageRect.h = FONT_HEIGHT;

    SDL_RenderCopy(m_renderer, message, nullptr, &messageRect);

    SDL_FreeSurface(surface);
    SDL_DestroyTexture(message);
}

void
Scene::displayScroller()
{
    for (std::size_t i = 0; i < m_scrollerStrings.size(); ++i)
    {
        displayText(m_scrollerStrings[i], 0, i * FONT_HEIGHT);
    }
}

void
Scene::drawButton(const SDL_Rect& button,
                  const SDL_Color& color)
{
    SDL_Color prevColor;
    SDL_GetRenderDrawColor(m_renderer,
                           &prevColor.r,
                           &prevColor.g,
                           &prevColor.b,
                           &prevColor.a);

    SDL_SetRenderDrawColor(m_renderer,
                           color.r,
                           color.g,
                           color.b,
                           color.a);


    SDL_RenderFillRect(m_renderer,
                       &button);

    SDL_SetRenderDrawColor(m_renderer,
                           prevColor.r,
                           prevColor.g,
                           prevColor.b,
                           prevColor.a);
}

void
Scene::addTextToScroller(const std::string& str)
{
    if (m_scrollerStrings.size() > DISPLAY_LIMIT)
    {
        m_scrollerStrings.erase(m_scrollerStrings.begin());
    }

    m_scrollerStrings.push_back(str);
}

void
Scene::handleEvent(const SDL_Event& event)
{
    if (event.type == SDL_QUIT)
    {
        m_running = false;
        m_continueProgram = false;
    }
}

bool
Scene::isClicked(const SDL_Rect& button,
                    const int xPos, const int yPos)
{
    return (xPos >= button.x && xPos <= button.x + button.w &&
            yPos >= button.y && yPos <= button.y + button.h);

}

