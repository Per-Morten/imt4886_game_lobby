sources = 									\
			chat_client.cpp 				\
			chat_room_lister.cpp			\
		  	chat_menu.cpp 					\
		  	chat_server.cpp 				\
		  	chat_server_configurator.cpp 	\
		  	kjapp.cpp						\
		  	main.cpp 						\
		  	scene.cpp						\

std_flags =									\
			-std=c++14						\
			-Wold-style-cast				\
			-Wall							\
			-Wextra							\

linker_flags = 								\
			-lcurl							\
			-lSDL2							\
			-lSDL2_net						\
			-lSDL2_ttf						\
			-lpthread						\

.PHONY: clean
clean:
	rm -f ./chat

chat: $(sources) clean
	g++-7 $(sources) -o chat $(std_flags) $(linker_flags)

chat_leak: $(sources) clean
	g++-7 $(sources) -o chat -fno-omit-frame-pointer -fsanitize=address -g3 -Og $(std_flags) $(linker_flags); ASAN_OPTIONS=detect_leaks=1

.PHONY: run
run: clean chat
	./chat
