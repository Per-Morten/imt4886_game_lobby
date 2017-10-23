#pragma once
#include <cstddef>
#include <cstdint>

namespace kjapp
{
    void
    hostMatch(const char* gameToken,
              const char* name,
              const char* hostIp,
              const std::uint16_t hostPort,
              const std::size_t maxPlayerCount);

}
