#pragma once
#include "scene.h"
#include "kjapp.h"

class ChatRoomLister
    : public Scene
{
public:
    ChatRoomLister(SDL_Window* window,
                   SDL_Renderer* renderer);

    virtual ~ChatRoomLister() {};

    virtual
    SceneResult
    run() override;

private:
    void
    drawMatches();

    void
    updateMatchSelection(const int mouseX, const int mouseY);

    kjapp::Query m_currentQuery{};

    std::vector<nlohmann::json> m_matches{};
    bool m_updateMatches{true};
    nlohmann::json* m_selectedMatch{};

    SDL_Rect m_allMatchesButton{};
    SDL_Rect m_inSessionButton{};
    SDL_Rect m_notInSessionButton{};
    SDL_Rect m_nonFullButton{};
    SDL_Rect m_byNameButton{};
    SDL_Rect m_joinButton{};
    SDL_Rect m_usernameButton{};

    std::string m_search{};
    std::string m_username{"User"};

    std::string* m_input{&m_search};
};
