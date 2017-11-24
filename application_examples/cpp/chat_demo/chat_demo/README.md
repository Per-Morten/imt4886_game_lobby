# Kjapp Wrapper Installation & Chat Demo 
This chat demo shows an example of using kjapp in C++.  
It also includes kjapp.h and kjapp.cpp which is a wrapper lib for interaction with
the kjapp REST API using curl.  
Below follows some instructions on using the wrapper library or running the demo.  
They are relatively short on the linux side, as that is easier to set up.  
Most time has been used to write the visual studio setup, as that is a bit more involved.  

## "Installing" kjapp wrapper library
### Linux
Using the wrapper library on linux is pretty straight forward, just copy the two kjapp files,  
add them to your cmake/make files and add curl as a dependency.  
If you don't have curl installed it can probably be added with a simple apt-get like command.  

### Windows (Visual Studio)
To use the kjapp wrapper library on windows copy the two kjapp files into your visual studio project.  
Additionally you need to setup curl, which is a bit more involved on windows.  
You can build curl from scratch which there are tutorials for on the net,  
or you can download what you need from [https://curl.haxx.se/download.html](https://curl.haxx.se/download.html).  
This guide assumes you don't build curl yourself, and that you download the version from Viktor Szakáts.  

After downloading you need to add the library paths to your visual studio project.  
I suggest setting up an environment variable that points to the curl folder (called "CURL_HOME" or something),  
however this is not strictly necessary.  

Add: "<your_curl_path>\include" (Without quotation marks) to the additional include directories field.  
This field is found by going: project -> properties -> C/C++ -> General  
If you are using an environment variable it should look something like this: 
```
$(CURL_HOME)\include
```

Add: "<your_curl_path>\lib" (Without quotation marks) to the additional library directories field.  
This field is found by going: project -> properties -> Linker -> General  
If you are using an environment variable it should look something like this: 
```
$(CURL_HOME)\lib
```

Add: "libcurl.dll.a" (Without quotation marks) to the additional dependencies field.  
This field is found by going: project -> properties -> Linker -> Input  
This step probably depends on how you got Curl, if you built it yourself or downloaded it from a different source.  
You can read about .a files here: [Stack Overflow](https://stackoverflow.com/questions/2337949/whats-the-difference-between-lib-and-a-files).  

You should now be able to build the files, but will probably get an error about missing libcurl.dll.  
In that case copy the libcurl.dll from "<your_curl_path>\bin" into your visual studio projects outermost Debug/Release folder.  

In the case where you get more missing dll's like: libcypto-1_1.dll and libssl-1_1.dll  
Download these from the net and add them to your visual studio projects outermost Debug/Release folder.  

This should be everything you need to use the kjapp wrapper lib in your visual studio project.  

## Running the Chat Demo
### Linux
To run the chat demo on linux, just change into the directory of the Makefile and write make run.  
In case you don't have g++-7 you can probably change that to regular g++, as long as it has c++14 support.  
Additionally you need to have downloaded curl, which is probably just a simple apt-get like command.  
You also need SDL2, SDL2_net and SDL2_ttf, but again, these should be relatively simple to install on linux.  

### Windows (Visual Studio)
The project in the repo assumes that you have setup curl as described in the ""installing" kjapp wrapper library",  
and that you have set up an environment variable called CURL_HOME.  
Additionally you need to have downloaded the following libraries and set up correct environment variables for them:  

| Library   | Environment Variable |
|-----------|----------------------|
| SDL2      | SDL_HOME             |
| SDL2_net  | SDL_NET_HOME         |
| SDL2_ttf  | SDL_TTF_HOME         |

Additionally you need to add all the DLL's from those libraries to the outermost Debug/Release folder.  
That should be all.  

## Chat Demo Code
The code in the chat demo should be pretty self explanatory, especially after seeing the demo in action.  
The exception is probably all the random magic numbers used when creating rectangles etc.  
This is just to get the demo to look semi decent on screen.  
