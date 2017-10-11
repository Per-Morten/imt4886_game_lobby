using System.Collections;
using System.Text;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

/// <summary>
/// A extended NetworkManager that works as an example for how to interact with the Lobby API
/// </summary>
public class KJAPPNetworkManager : NetworkManager
{
    [Header("KJAPP specific")]
    public string gameToken;
    public string apiUrl;
    public int maxPlayersPerMatch = 8;

    private string matchId = "";
    private const int MATCH_STATUS_IN_SESSION = 1;

    private int playerCount = 1;

    #region Public Methods
    /// <summary>
    /// Public method that can be called by a button on the UI(as an example) in order to start the process creating a match.
    /// </summary>
    public void StartHosting(string matchName)
    {
        StartCoroutine(AcquireExternalNetworkAddress(matchName));
    }

    /// <summary>
    /// Public method that can be called by a button on the UI(as an example) in order to start the process of connecting to a match.
    /// </summary>
    public void StartClientConnection(string ip, int port)
    {
        networkAddress = ip;
        networkPort = port;

        StartClient();
    }
    
    /// <summary>
    /// Public method that can be called by a button on the UI(as an example) in order to start the process of requesting a list of matches. 
    /// </summary>
    public void RequestMatches()
    {
        StartCoroutine(FetchMatches());
    }
    #endregion

    #region Private Helper Methods
    /// <summary>
    /// Helper function for manually building web requests to avoid issues that you might end up having from Unity doing things like url-encoding your body. 
    /// </summary>
    /// <param name="apiRouteAppendage">The part of the route to the API we want to append, example: "/match/"</param>
    /// <param name="jsonBody">The string containing the JSON object</param>
    /// <param name="requestType">Whether the request should be GET/POST/PUT etc</param>
    /// <returns>A web request that is ready for usage</returns>
    private UnityWebRequest CreateWebRequestWithBody(string apiRouteAppendage, string jsonBody, string requestType)
    {
        // http://answers.unity3d.com/questions/1163204/prevent-unitywebrequestpost-from-url-encoding-the.html
        var webRequest = new UnityWebRequest(apiUrl + apiRouteAppendage);
        webRequest.uploadHandler = new UploadHandlerRaw(Encoding.ASCII.GetBytes(jsonBody));
        webRequest.downloadHandler = new DownloadHandlerBuffer();
        webRequest.method = requestType;
        webRequest.SetRequestHeader("Content-Type", "application/json");

        return webRequest;
    }

    /// <summary>
    /// Coroutine that fetches the external IP address before calling UploadMatch();
    /// </summary>
    /// <param name="matchName">The name of the match acquired from the InputField in the UI</param>
    private IEnumerator AcquireExternalNetworkAddress(string matchName)
    {
        var webRequest = UnityWebRequest.Get("https://api.ipify.org?format=json");
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            networkAddress = JsonUtility.FromJson<NetworkAddressResponse>(webRequest.downloadHandler.text).ip;
            StartCoroutine(UploadMatch(matchName));
        }
    }
    #endregion

    #region API Coroutines
    /// <summary>
    /// Coroutine that sends a web request to the API in order to create a new match. 
    /// </summary>
    private IEnumerator UploadMatch(string matchName)
    {
        var webRequest = CreateWebRequestWithBody("/match/", JsonUtility.ToJson(new MatchPOSTRequest(matchName, gameToken, networkAddress, networkPort,  maxPlayersPerMatch)), 
                                                                                UnityWebRequest.kHttpVerbPOST);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        } 
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            matchId = JsonUtility.FromJson<MatchResponse>(jsonString)._id;
            StartCoroutine(SetMatchStatusToInSession());
            StartHost();
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API in order to set the status to the newly created match as in session. 
    /// </summary>
    private IEnumerator SetMatchStatusToInSession()
    {
        var webRequest = CreateWebRequestWithBody("/match/status", JsonUtility.ToJson(new MatchStatusPUTRequest(matchId, MATCH_STATUS_IN_SESSION)), UnityWebRequest.kHttpVerbPUT);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API and receives a list of matches with given gameToken
    /// </summary>
    private IEnumerator FetchMatches()
    {
        var webRequest = UnityWebRequest.Get(apiUrl + "/matches/no_body/" + gameToken);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            var matches = JsonHelper.getJsonArray<MatchResponse>(jsonString);
            GameObject.FindGameObjectWithTag("UIHandler").GetComponent<UIHandler>().DisplayMatches(matches);
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API in order to delete the finished match. 
    /// </summary>
    private IEnumerator DeleteMatch()
    {
        var webRequest = CreateWebRequestWithBody("/match/", JsonUtility.ToJson(new MatchDeleteRequest(matchId)), UnityWebRequest.kHttpVerbDELETE);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            matchId = "";
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API in order to update the amount of connected players.
    /// </summary>
    /// <returns></returns>
    private IEnumerator UpdatePlayerCount()
    {
        if (matchId != "")
        {
            var webRequest = CreateWebRequestWithBody("/match/player_count/", JsonUtility.ToJson(new MatchPlayerCountPUTRequest(matchId, playerCount)), UnityWebRequest.kHttpVerbPUT);
            yield return webRequest.Send();

            if (webRequest.isNetworkError)
            {
                Debug.Log(webRequest.error);
            }
        }
    }
    #endregion

    #region Callbacks
    
    /// <summary>
    /// NetworkManager callback that runs on the server whenever it stops.
    /// A finished match should be deleted from the database so this callback can be used to do so. 
    /// </summary>
    public override void OnStopServer()
    {
        StartCoroutine(DeleteMatch());
    }
    
    /// <summary>
    /// Callback that is called on the server whenever a client connects. Note: The host also counts as a client
    /// We use this to update the player count of the match. 
    /// </summary>
    public override void OnServerConnect(NetworkConnection conn)
    {
        // Somewhat of a hack, but we dont want to update the playerCount field of the host as this already is done through match creation
        // The reason for this is that the match itself will not be accessible for PUT requests this early.
        if (NetworkServer.connections.Count > 1)
        {
            playerCount++;
            StartCoroutine(UpdatePlayerCount());
        }
    }
    
    /// <summary>
    /// Callback that is called on the server whenever a client disconnects.
    /// We use this to update the player count of the match.
    /// </summary>
    public override void OnServerDisconnect(NetworkConnection conn)
    {
        playerCount--;
        StartCoroutine(UpdatePlayerCount());
        NetworkServer.DestroyPlayersForConnection(conn);
    }
    #endregion

    #region Inner Classes
    /// <summary>
    /// Minor helper class used to contain the external ip address acquired from https://api.ipify.org
    /// </summary>
    [System.Serializable]
    private class NetworkAddressResponse
    {
        public string ip = "";
    }
    #endregion
}
