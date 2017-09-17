

## Notes from Unity doc

<https://docs.unity3d.com/Manual/UNetLobby.html>

* Don't destroy network lobby on load
* run lobby in background
* min and max amount of players for a chosen game 
* 


Create lobby player from LobbyPlayerPrefab
* One LobbyPlayer for each player
* Created when client connects, or player is added
* Exists until client disconnects
* Holds the ready flag for this player for the lobby
* Handles commands while in the lobby
* Add user scripts to this prefab to hold game-specific player data
* This prefab must have a [NetworkLobbyPlayer](https://docs.unity3d.com/ScriptReference/Networking.NetworkLobbyPlayer.html) component

### Gameplayer
The GamePlayer is created from the GamePlayerPrefab when the game starts:

* One GamePlayer for each player
* Created when game Scene is started
* Destroyed when re-entering lobby
* Handles commands while in the game
* This Prefab must have a [NetworkIdentity](https://docs.unity3d.com/ScriptReference/Networking.NetworkIdentity.html) component

###Minimum Players

The **Minimum Players** field represents the minimum number of “Ready” players in the Lobby to start the Match with. If the number of connected clients is more than the “Minimum Players” value, then waiting for all connected clients to become “Ready” starts the Match.

For example if “Minimum Players” is set to 2:

* Start one instance of the game and start Host. Then in game Lobby UI press Start for your player. You are still in Lobby mode, because the minimum number of Ready players to start the game is 2.
* Start two more instances of the game, and start Clients there. It doesn’t matter that “Minimum Players” set to 2. Wait for all connected players to become Ready.
* Press Start in Lobby UI for one player. Two players are Ready, but still in Lobby mode. Press “Start” in the Lobby UI for the last player, and all players are moved to Game mode.

Examples of virtual function callbacks that  can be used for custom lobby behaviour

```
	public virtual void OnClientEnterLobby();
    public virtual void OnClientExitLobby();
    public virtual void OnClientReady(bool readyState);
```

[Unity lobby sample project](https://www.assetstore.unity3d.com/en/?&_ga=2.202106641.1605402025.1505651608-1251805371.1505651608#!/content/41836) 

## notes from Garena

<http://betaclient.garena.ph/>

* interface that supports instant messaging
* check game progress and achievements
* friendslist
* gamers can create their own unique avatar and change their names
* form groups or clans
* private and public chats(group chats also)
* virtual currency (not really something we need to worry about)
* built in news about games
* FAQ
* voice chat 
* install and patch games

## Other game lobby notes

* shop
* manage account
* scan/repair game
* game guide 
* manage account
* redeem a code
* stream to facebook/twitch
* send feedback 
* support
* settings
* decide online status (available, busy, away, show as offline)
* matchmaking ( done by game or lobby???)

### SmartFoxServer2X

Linking this here. This is an example of a browser application showing how to create a lobby based on an api.
<http://docs2x.smartfoxserver.com/ExamplesJS/game-lobby>

<https://docs.unrealengine.com/latest/INT/Programming/Online/Interfaces/Session/>

| | | 