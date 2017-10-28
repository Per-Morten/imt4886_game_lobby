#include "chat_server_configurator.h"
#include "chat_server.h"

ChatServerConfigurator::ChatServerConfigurator(SDL_Window* window,
                                               SDL_Renderer* renderer)
    : Scene(window, renderer)
{
    int height;
    int width;
    SDL_GetWindowSize(m_window, &width, &height);

    m_headline.w = width;
    m_headline.h = height / 8;
    m_headline.x = 0;
    m_headline.y = 0;

    m_nameEntry.w = width;
    m_nameEntry.h = height / 8;
    m_nameEntry.x = 0;
    m_nameEntry.y = m_headline.h;

    m_portEntry.w = width;
    m_portEntry.h = height / 8;
    m_portEntry.x = 0;
    m_portEntry.y = m_nameEntry.y + m_nameEntry.h;

    m_maxClientsEntry.w = width;
    m_maxClientsEntry.h = height / 8;
    m_maxClientsEntry.x = 0;
    m_maxClientsEntry.y = m_portEntry.y + m_portEntry.h;

    m_hostButton.w = width;
    m_hostButton.h = height / 8;
    m_hostButton.x = 0;
    m_hostButton.y = m_maxClientsEntry.y + (m_maxClientsEntry.h * 2);
}

SceneResult
ChatServerConfigurator::run()
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

                if (isClicked(m_nameEntry, mouseX, mouseY))
                {
                    m_currentInput = &m_name;
                    m_currentMode = TextEntryMode::TEXT_ENTRY;
                }
                if (isClicked(m_portEntry, mouseX, mouseY))
                {
                    m_currentInput = &m_port;
                    m_currentMode = TextEntryMode::NUMERIC_ENTRY;
                }
                if (isClicked(m_maxClientsEntry, mouseX, mouseY))
                {
                    m_currentInput = &m_maxClients;
                    m_currentMode = TextEntryMode::NUMERIC_ENTRY;
                }

                if (isClicked(m_hostButton, mouseX, mouseY))
                {
                    m_error.clear();
                    try
                    {
                        // TODO:
                        // Add more error checking here,
                        // port must be >= 0 && <= 65535
                        // and maxClients can go out of range, which will then not display
                        // a nice error message.
                        auto port = std::stoul(m_port);

                        auto server = std::make_unique<ChatServer>(m_window,
                                                                   m_renderer,
                                                                   m_name,
                                                                   port,
                                                                   std::stoul(m_maxClients));

                        return {m_continueProgram, std::move(server)};
                    }
                    catch (const std::exception& e)
                    {
                        m_error = e.what();
                    }
                }
            }

            if (event.type == SDL_KEYUP &&
                event.key.keysym.sym == SDLK_BACKSPACE &&
                !m_currentInput->empty())
            {
                m_currentInput->pop_back();
            }

            if (event.type == SDL_TEXTINPUT &&
                (m_currentMode ==  TextEntryMode::TEXT_ENTRY ||
                 (m_currentMode == TextEntryMode::NUMERIC_ENTRY &&
                  event.text.text[0] >= '0' &&
                  event.text.text[0] <= '9')))
            {
                m_currentInput->push_back(event.text.text[0]);
            }
        }

        SDL_RenderClear(m_renderer);
        const SDL_Color black = {0, 0, 0, 255};
        drawButton(m_headline, black);
        drawButton(m_nameEntry, black);
        drawButton(m_portEntry, black);
        drawButton(m_maxClientsEntry, black);
        drawButton(m_hostButton, black);

        const auto headline = "Configure server:" + m_error;
        displayText(headline, m_headline.x, m_headline.y);

        const auto nameText = "name: " + m_name;
        displayText(nameText.c_str(), m_nameEntry.x, m_nameEntry.y);

        const auto portText = "port: " + m_port;
        displayText(portText.c_str(), m_portEntry.x, m_portEntry.y);

        const auto maxClients = "max clients: " + m_maxClients;
        displayText(maxClients.c_str(), m_maxClientsEntry.x, m_maxClientsEntry.y);

        displayText("Click to host", m_hostButton.x, m_hostButton.y);

        SDL_RenderPresent(m_renderer);
    }

    return {m_continueProgram, nullptr};
}
