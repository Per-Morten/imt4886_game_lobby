#include "chat_room_lister.h"

#include <cstdio>
#include <cstdlib>

#include "chat_client.h"

ChatRoomLister::ChatRoomLister(SDL_Window* window,
                               SDL_Renderer* renderer)
    : Scene(window, renderer)
{
    int height;
    int width;
    SDL_GetWindowSize(m_window, &width, &height);

    // Username bar
    m_usernameButton.h = height / 8;
    m_usernameButton.w = width;
    m_usernameButton.x = 0;
    m_usernameButton.y = height - (m_usernameButton.h * 3);

    // Top row buttons
    m_allMatchesButton.w = width / 4;
    m_allMatchesButton.h = height / 8;
    m_allMatchesButton.x = 0;
    m_allMatchesButton.y = height - (m_allMatchesButton.h * 2);

    m_inSessionButton.w = width / 4;
    m_inSessionButton.h = height / 8;
    m_inSessionButton.x = m_allMatchesButton.x + m_allMatchesButton.w;
    m_inSessionButton.y = height - (m_inSessionButton.h * 2);

    m_notInSessionButton.w = width / 4;
    m_notInSessionButton.h = height / 8;
    m_notInSessionButton.x = m_inSessionButton.x + m_inSessionButton.w;
    m_notInSessionButton.y = height - (m_notInSessionButton.h * 2);

    m_nonFullButton.w = width / 4;
    m_nonFullButton.h = height / 8;
    m_nonFullButton.x = m_notInSessionButton.x + m_notInSessionButton.w;
    m_nonFullButton.y = height - (m_nonFullButton.h * 2);

    // Bottom row buttons
    m_byNameButton.w = width / 2;
    m_byNameButton.h = height / 8;
    m_byNameButton.x = 0;
    m_byNameButton.y = height - m_byNameButton.h;

    m_joinButton.w = width / 2;
    m_joinButton.h = height / 8;
    m_joinButton.x = m_byNameButton.x + m_byNameButton.w;
    m_joinButton.y = height - m_joinButton.h;
}

SceneResult
ChatRoomLister::run()
{
    while (m_running)
    {
        SDL_RenderClear(m_renderer);
        SDL_Event event;
        while (SDL_PollEvent(&event))
        {
            Scene::handleEvent(event);

            if (event.type == SDL_MOUSEBUTTONUP)
            {
                const int mouseX = event.button.x;
                const int mouseY = event.button.y;

                if (isClicked(m_allMatchesButton, mouseX, mouseY))
                {
                    m_currentQuery = kjapp::Query::ALL_MATCHES;
                    m_updateMatches = true;
                }

                if (isClicked(m_inSessionButton, mouseX, mouseY))
                {
                    m_currentQuery = kjapp::Query::IN_SESSION;
                    m_updateMatches = true;
                }

                if (isClicked(m_notInSessionButton, mouseX, mouseY))
                {
                    std::printf("Not implemented\n");
                    #if 0
                    m_currentQuery = kjapp::Query::NOT_IN_SESSION;
                    m_updateMatches = true;
                    #endif
                }

                if (isClicked(m_nonFullButton, mouseX, mouseY))
                {
                    m_currentQuery = kjapp::Query::NON_FULL_MATCHES;
                    m_updateMatches = true;
                }

                if (isClicked(m_byNameButton, mouseX, mouseY))
                {
                    std::printf("Not implemented\n");
                    #if 0
                    m_currentQuery = kjapp::Query::BY_NAME;
                    m_updateMatches = true;
                    m_input = &m_search;
                    #endif
                }

                if (isClicked(m_usernameButton, mouseX, mouseY))
                {
                    m_input = &m_username;
                }

                if (isClicked(m_joinButton, mouseX, mouseY) &&
                    m_selectedMatch != nullptr)
                {
                    try
                    {
                        // Ensure that we update matches if we go back.
                        m_updateMatches = true;
                        auto client = std::make_unique<ChatClient>(m_window,
                                                                   m_renderer,
                                                                   (*m_selectedMatch)["hostIP"].get<std::string>(),
                                                                   (*m_selectedMatch)["hostPort"].get<std::uint16_t>(),
                                                                   m_username);

                        return {m_continueProgram, std::move(client)};
                    }
                    catch (const std::exception& e)
                    {
                        std::printf("Error: %s\n", e.what());
                    }
                }

                updateMatchSelection(mouseX, mouseY);
            }

            if (event.type == SDL_MOUSEWHEEL)
            {
                handleMouseWheel(event);
            }

            if (event.type == SDL_TEXTINPUT)
            {
                m_input->push_back(event.text.text[0]);
            }

            if (event.type == SDL_KEYUP &&
                event.key.keysym.sym == SDLK_BACKSPACE &&
                !m_input->empty())
            {
                m_input->pop_back();
            }
        }

        if (m_updateMatches)
        {
            try
            {
                m_selectedMatch = nullptr;
                m_updateMatches = false;
                m_matches = kjapp::getMatches(GAME_TOKEN,
                                              m_currentQuery,
                                              m_search);
            }
            catch (const std::exception& e)
            {
                std::printf("Error: %s\n", e.what());
            }
        }

        const SDL_Color black = {0, 0, 0, 255};
        drawButton(m_usernameButton, black);
        drawButton(m_allMatchesButton, black);
        drawButton(m_inSessionButton, black);
        drawButton(m_notInSessionButton, black);
        drawButton(m_nonFullButton, black);
        drawButton(m_byNameButton, black);
        drawButton(m_joinButton, black);

        const auto username = "Username: " + m_username;
        displayText(username.c_str(), m_usernameButton.x, m_usernameButton.y);

        displayText("All matches", m_allMatchesButton.x, m_allMatchesButton.y);
        displayText("In Session", m_inSessionButton.x, m_inSessionButton.y);
        displayText("Not In Session", m_notInSessionButton.x, m_notInSessionButton.y);
        displayText("Not Full", m_nonFullButton.x, m_nonFullButton.y);
        displayText("By Name", m_byNameButton.x, m_byNameButton.y);
        displayText("Join", m_joinButton.x, m_joinButton.y);

        drawMatches();

        SDL_RenderPresent(m_renderer);
    }

    return {m_continueProgram, nullptr};
}

void
ChatRoomLister::drawMatches()
{
    int height;
    int width;
    SDL_GetWindowSize(m_window, &width, &height);

    const std::size_t displayLength = (m_matches.size() <= 5)
                                    ? m_matches.size()
                                    : 5;

    for (std::size_t i = 0; i < displayLength; ++i)
    {
        SDL_Rect position;
        position.w = width;
        position.h = height / 10;
        position.x = 0;
        position.y = i * position.h;

        const auto color = (&m_matches[i] == m_selectedMatch)
                         ? SDL_Color{0, 0, 128, 255}
                         : SDL_Color{0, 0, 0, 255};

        drawButton(position, color);
        displayText(m_matches[i]["name"].get<std::string>().c_str(), position.x, position.y);
    }
}

void
ChatRoomLister::updateMatchSelection(const int mouseX, const int mouseY)
{
    int height;
    int width;
    SDL_GetWindowSize(m_window, &width, &height);

    const std::size_t vecLength = (m_matches.size() <= 5)
                                ? m_matches.size()
                                : 5;

    for (std::size_t i = 0; i < vecLength; ++i)
    {
        SDL_Rect position;
        position.w = width;
        position.h = height / 10;
        position.x = 0;
        position.y = i * position.h;

        if (isClicked(position, mouseX, mouseY))
        {
            m_selectedMatch = (m_selectedMatch != &m_matches[i])
                            ? &m_matches[i]
                            : nullptr;
        }
    }
}

void
ChatRoomLister::handleMouseWheel(const SDL_Event& event)
{
    if (m_matches.size() < 5 || std::abs(event.wheel.y) != 1)
        return;

    auto newFirst = (event.wheel.y == -1)
                  ? std::next(std::begin(m_matches))
                  : std::prev(std::end(m_matches));

    std::rotate(std::begin(m_matches),
                newFirst,
                std::end(m_matches));

    m_selectedMatch = nullptr;
}
