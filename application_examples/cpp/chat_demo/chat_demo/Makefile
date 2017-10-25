sources =  chat_client.cpp chat_server.cpp kjapp.cpp main.cpp

all: $(sources)
	g++-7 $(sources) -o chat -Wall -Wextra -std=c++14 -lcurl -lSDL2 -lSDL2_net -lpthread

.PHONY: clean
clean:
	rm -f ./chat_client ./chat_server ./chat

.PHONY: run_server
run_server: clean all
	./chat -s

.PHONY: run_client
run_client: clean all
	./chat
