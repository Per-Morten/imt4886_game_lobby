#include "chat_menu.h"
#include "chat_server.h"
#include "chat_client.h"
#include "chat_server_configurator.h"

ChatMenu::ChatMenu(SDL_Window* window,
                   SDL_Renderer* renderer)
    : Scene(window, renderer)
{
    int height;
    int width;
    SDL_GetWindowSize(m_window, &width, &height);


    m_hostButton.w = width / 6;
    m_hostButton.h = height / 4;
    m_hostButton.x = m_hostButton.w;
    m_hostButton.y = height / 2;

    m_joinButton.w = width / 6;
    m_joinButton.h = height / 4;
    m_joinButton.x = width - m_joinButton.w * 2;
    m_joinButton.y = height / 2;
}

SceneResult
ChatMenu::run()
{
    while (m_running)
    {
        SDL_Event event;
        while (SDL_PollEvent(&event))
        {
            Scene::handleEvent(event);

            if (event.type == SDL_MOUSEBUTTONUP)
            {
                const int mouseX = event.button.x;
                const int mouseY = event.button.y;

                if (isClicked(m_hostButton, mouseX, mouseY))
                {
                    auto server =
                        std::make_unique<ChatServerConfigurator>(m_window,
                                                                 m_renderer);

                    return {m_continueProgram, std::move(server)};
                }
                if (isClicked(m_joinButton, mouseX, mouseY))
                {
                    auto client = std::make_unique<ChatClient>(m_window,
                                                               m_renderer,
                                                               "127.0.0.1",
                                                               8000);
                    return {m_continueProgram, std::move(client)};
                }
            }
        }

        const SDL_Color black = {0, 0, 0, 255};
        SDL_RenderClear(m_renderer);
        drawButton(m_hostButton, black);
        drawButton(m_joinButton, black);

        displayText("Host",
                    m_hostButton.x + m_hostButton.w / 3,
                    m_hostButton.y + m_hostButton.h / 2);

        displayText("Join",
                    m_joinButton.x + m_hostButton.w / 3,
                    m_joinButton.y + m_joinButton.h / 2);
        SDL_RenderPresent(m_renderer);
    }

    return {m_continueProgram, nullptr};
}

