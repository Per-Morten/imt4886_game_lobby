using System.Collections;
using System.Text;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.Threading.Tasks;

/// <summary>
/// Enum used for defining which filter to use when sending a GET request for matches
/// </summary>
public enum GETRequestFilters
{
    noFilter = 0,
    inSession,
    notInSession,
    notFull,
    withName
};

/// <summary>
/// A extended NetworkManager that works as an example for how to interact with the Lobby API
/// </summary>
public class KJAPPNetworkManager : NetworkManager
{
    [Header("KJAPP specific")]
    public string gameToken;
    public string apiUrl;
    public int maxPlayersPerMatch = 8;
    public bool matchReportsEnabled = false;

    private string matchId = "";
    private const int MATCH_STATUS_IN_SESSION = 1;

    private int playerCount = 1;
    private float matchStartTime = -1;

    #region Public Methods
    /// <summary>
    /// Public method that can be called by a button on the UI(as an example) in order to start the process creating a match.
    /// </summary>
    /// <param name="matchName">Name of the match</param>
    /// <param name="loopBackHost">Whether we want to use 127.0.0.1 as host IP or not. This primarily used for testing purposes on the local machine</param>
    public void StartHosting(string matchName, bool loopBackHost)
    {
        if (!loopBackHost)
        {
            StartCoroutine(AcquireExternalNetworkAddress(matchName));
        }
        else
        {
            networkAddress = "127.0.0.1";
            StartCoroutine(UploadMatch(matchName));
        }

        if (matchReportsEnabled)
        {
            matchStartTime = Time.realtimeSinceStartup;
        }
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
    public void RequestMatches(GETRequestFilters filter, string withName = "")
    {
        StartCoroutine(FetchMatches(filter, withName));
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
        var webRequest = CreateWebRequestWithBody("/match/", 
                                                  JsonUtility.ToJson(new KJAPP.JSONObjects.Match.POSTRequest(matchName, gameToken, networkAddress, networkPort,  maxPlayersPerMatch)), 
                                                  UnityWebRequest.kHttpVerbPOST);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        } 
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            matchId = JsonUtility.FromJson<KJAPP.JSONObjects.Match.BaseResponse>(jsonString)._id;
            StartCoroutine(SetMatchStatusToInSession());
            StartHost();
            OpenNat.PortForward().Wait();
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API in order to set the status to the newly created match as in session. 
    /// </summary>
    private IEnumerator SetMatchStatusToInSession()
    {
        var webRequest = CreateWebRequestWithBody("/match/status", 
                                                  JsonUtility.ToJson(new KJAPP.JSONObjects.Match.StatusPUTRequest(matchId, MATCH_STATUS_IN_SESSION)), 
                                                  UnityWebRequest.kHttpVerbPUT);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API and receives a list of matches with given gameToken. A filter is sent to specify what types of matches to GET.
    /// </summary>
    /// <param name="filter">The enum specifying how to filter the matches that are to be acquired.</param>
    /// <param name="matchSearchName">The name of the match we want to search for in the case that filter is GETRequestFilters.byName</param>
    private IEnumerator FetchMatches(GETRequestFilters filter, string matchSearchName = "")
    {
        var apiEndpoint = "";

        switch(filter)
        {
            case GETRequestFilters.noFilter:
                apiEndpoint = "/matches/no_body/" + gameToken;
                break;
            case GETRequestFilters.inSession:
                apiEndpoint = "/matches/in_session/no_body/" + gameToken;
                break;
            case GETRequestFilters.notInSession:
                apiEndpoint = "/matches/not_in_session/no_body/" + gameToken;
                break;
            case GETRequestFilters.notFull:
                apiEndpoint = "/matches/not_full/no_body/" + gameToken;
                break;
            case GETRequestFilters.withName:
                apiEndpoint = "/matches/with_name/no_body/" + gameToken + "/" + matchSearchName;
                break;
            default:
                apiEndpoint = "/matches/no_body/" + gameToken;
                break;
        }

        var webRequest = UnityWebRequest.Get(apiUrl + apiEndpoint);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            var matches = JsonHelper.getJsonArray<KJAPP.JSONObjects.Match.BaseResponse>(jsonString);
            GameObject.FindGameObjectWithTag("UIHandler").GetComponent<UIHandler>().DisplayMatches(matches);
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API in order to delete the finished match. 
    /// </summary>
    private IEnumerator DeleteMatch()
    {
        var webRequest = CreateWebRequestWithBody("/match/", JsonUtility.ToJson(new KJAPP.JSONObjects.Match.DeleteRequest(matchId)), UnityWebRequest.kHttpVerbDELETE);
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
            var webRequest = CreateWebRequestWithBody("/match/player_count/", 
                                                      JsonUtility.ToJson(new KJAPP.JSONObjects.Match.PlayerCountPUTRequest(matchId, playerCount)), 
                                                      UnityWebRequest.kHttpVerbPUT);
            yield return webRequest.Send();

            if (webRequest.isNetworkError)
            {
                Debug.Log(webRequest.error);
            }
        }
    }

    /// <summary>
    /// Coroutine that sends a match report to the API for archiving.
    /// </summary>
    /// <param name="reportData">An object containing matchID, gameToken and a data object that can be of any type</param>
    private IEnumerator SendReport(object report)
    {
        var webRequest = CreateWebRequestWithBody("/match_report/", 
                                                  JsonUtility.ToJson(report), 
                                                  UnityWebRequest.kHttpVerbPOST);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
    }
    #endregion

    #region Callbacks
    /// <summary>
    /// NetworkManager callback that runs on the server whenever it stops.
    /// A finished match should be deleted from the database so this callback can be used to do so. 
    /// If you want to send match reports after a match ends, this could be a potential place to do so. 
    /// </summary>
    public override void OnStopServer()
    {
        if (matchReportsEnabled)
        {
            StartCoroutine(SendReport(new ReportPOSTRequest(matchId,
                                      gameToken,
                                      new KJAPP.JSONObjects.Report.ExampleDataObject(GameManager.instance.score, (int)(Time.realtimeSinceStartup - matchStartTime)))));
        }

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

    /// <summary>
    /// Unity's ToJson method does unfortunately not work with variable "object" types as these cannot be serialized,
    /// so the easiest workaround is to define the type of data yourself here. 
    /// </summary>
    [System.Serializable]
    class ReportPOSTRequest
    {
        public string matchID = "";
        public string gameToken = "";
        public KJAPP.JSONObjects.Report.ExampleDataObject data = null;

        public ReportPOSTRequest(string matchID, string gameToken, KJAPP.JSONObjects.Report.ExampleDataObject data)
        {
            this.matchID = matchID;
            this.gameToken = gameToken;
            this.data = data;
        }
    }
    #endregion
}
