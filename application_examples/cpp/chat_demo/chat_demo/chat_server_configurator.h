#pragma once
#include "scene.h"


class ChatServerConfigurator
    : public Scene
{
public:
    ChatServerConfigurator(SDL_Window* window,
                           SDL_Renderer* renderer);

    virtual ~ChatServerConfigurator() {};

    virtual
    SceneResult
    run() override;

private:
    enum class TextEntryMode
    {
        TEXT_ENTRY,
        NUMERIC_ENTRY,
    };

    TextEntryMode m_currentMode{TextEntryMode::TEXT_ENTRY};

    SDL_Rect m_headline{};
    SDL_Rect m_hostButton{};

    SDL_Rect m_nameEntry{};
    std::string m_name{};

    SDL_Rect m_portEntry{};
    std::string m_port{"8000"};

    SDL_Rect m_maxClientsEntry{};
    std::string m_maxClients{"10"};

    std::string m_error{};

    std::string* m_currentInput{&m_name};
};
