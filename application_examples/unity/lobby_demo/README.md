# General information about the Unity Example

## Classes to work with.
* Any classes related to the API will be found in the "/Scripts/Kjapp Related/" folder 
* KJAPPNetworkManager is the primary class that handles all interfacing with the API. 
	* It functions like your standard NetworkManager, but contains public wrapper methods that take care of API calls and basic NetworkManager methods like StartHost(), StopHost() and StartClient().
	* You will generally be using this class instead of Unity's default NetworkManager.
	* Feel free to modify, derive or extend the class as network functionality is rather embedded into the NetworkManager class and additional/modified functionality may be preferred. 

## Sending match reports
* The KJAPPNetworkManager class already contains a very simple example of how to send a match report with some score and duration data.
* This is handled by making your own request object(or just modify the example class inside the network manager to suit your needs) that contains three fields:
		* matchID 
		* gameToken
		* data
* Do note that names are case sensitive and have to match what is mentioned here for the API to accept your request. 
* The data object can contain an arbitrary amount of serializable data types for storing data like analytics or scores for leaderboards. 