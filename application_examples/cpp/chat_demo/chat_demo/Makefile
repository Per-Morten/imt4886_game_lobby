sources = chat_client.cpp chat_menu.cpp chat_server.cpp kjapp.cpp main.cpp scene.cpp

.PHONY: clean
clean:
	rm -f ./chat_client ./chat_server ./chat

all: $(sources) clean
	g++-7 $(sources) -o chat -Wall -Wextra -std=c++14 -lcurl -lSDL2 -lSDL2_net -lSDL2_ttf -lpthread

leak: $(sources) clean
	g++-7 $(sources) -o chat -fno-omit-frame-pointer -fsanitize=address -g3 -Og -Wall -Wextra -std=c++14 -lcurl -lSDL2 -lSDL2_net -lSDL2_ttf -lpthread; ASAN_OPTIONS=detect_leaks=1

.PHONY: run_server
run_server: clean all
	./chat -s

.PHONY: run_client
run_client: clean all
	./chat
