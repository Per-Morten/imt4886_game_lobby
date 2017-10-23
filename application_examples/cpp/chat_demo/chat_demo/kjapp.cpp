#include "kjapp.h"
#include <cstdio>
#include <SDL_net.h>
#include <cstring>
#include <cinttypes>

void kjapp::hostMatch(const char* gameToken, 
                      const char* name, 
                      const char* hostIp, 
                      const std::uint16_t hostPort, 
                      const std::size_t maxPlayerCount)
{
    // For format, look at:
    // https://www.ibm.com/support/knowledgecenter/en/SSSHTQ_8.1.0/com.ibm.netcool_OMNIbus.doc_8.1.0/omnibus/wip/api/reference/omn_api_http_examplehttp.html
    IPaddress kjappIp;
    if (SDLNet_ResolveHost(&kjappIp, "up.imt.hig.no", 8333) == -1)
    {
        std::printf("Could not resolve\n");
    }

//    const auto request = "POST /match/ HTTP/1.1\r\n"
//                         //"Host: up.imt.hig.no\r\n"
//                         //"Content-Type: application/json\r\n"
//                         "\r\n";
//                         "{\r\n"
//                         "  gameToken: \"59ec8be7890cd692461bb7d4\",\r\n"
//                         "  name: \"TestMatch\",\r\n"
//                         "  hostIP: \"localhost\",\r\n"
//        "   hostPort: 8800,\r\n"
//        "   maxPlayerCount: 0\r\n"
//        "}\r\n";

    const auto request = "GET / HTTP/1.1\r\n"
                         "Host: up.imt.hig.no\r\n"
        //"Accept: application/json\r\n"
        //"Connection: keep-alive\r\n"
        //"Content-Type: application/json\r\n"
        "\r\n";
    
    auto socket = SDLNet_TCP_Open(&kjappIp);
    auto address = SDLNet_TCP_GetPeerAddress(socket);
    printf("%" PRIu8 ".%" PRIu8 ".%" PRIu8 ".%" PRIu8 ":%" PRIu16 "\n",
           reinterpret_cast<std::uint8_t*>(&address->host)[0],
           reinterpret_cast<std::uint8_t*>(&address->host)[1],
           reinterpret_cast<std::uint8_t*>(&address->host)[2],
           reinterpret_cast<std::uint8_t*>(&address->host)[3],
           address->port);

    if (!socket)
    {
        std::printf("Could not connect\n");
    }
    std::printf("Connected\n");

    SDLNet_TCP_Send(socket, request, std::strlen(request) + 1);
    
    while (true)
    {
        char buffer[2048];
        int received = SDLNet_TCP_Recv(socket, buffer, 2048);
        printf("Received: %d bytes, %s\n", received, buffer);
        SDL_Delay(1000);
    }

    SDLNet_TCP_Close(socket);

    //constexpr int channel = 0;
    //auto socket = SDLNet_UDP_Open(8880);
    //if (!socket)
    //{
    //    printf("Couldnt create socket\n");
    //    return;
    //}
    //auto result = SDLNet_UDP_Bind(socket, channel, &kjappIp);
    //if (result == -1)
    //{
    //    printf("Could not bind socket\n");
    //    SDLNet_UDP_Close(socket);
    //    return;
    //}

    //#ifdef _MSC_VER
    //#pragma warning(push)
    //#pragma warning(disable : 4996)
    //#endif
    //int length = strlen(request) + 1;
    //auto packet = SDLNet_AllocPacket(length);
    //strcpy((char*)packet->data, request);
    //packet->len = length;
    //#ifdef _MSC_VER
    //#pragma warning(pop)
    //#endif

    //auto res = SDLNet_UDP_Send(socket, channel, packet);
    //printf("%d\n", res);
    ////if (res == 0)
    ////{
    ////    printf("UDP error\n");
    ////}

    //auto recvPacket = SDLNet_AllocPacket(2048);
    //int received = 0;
    //while (received = SDLNet_UDP_Recv(socket, recvPacket) == 0)
    //{
    //    //printf("Waiting\n");
    //}
   
    //if (received == -1)
    //    printf("Error\n");
    //else
    //    printf("Received something: %s\n", recvPacket->data);

    //SDLNet_FreePacket(packet);
    //SDLNet_FreePacket(recvPacket);

    //
    //SDLNet_UDP_Unbind(socket, channel);
    //SDLNet_UDP_Close(socket);
}
