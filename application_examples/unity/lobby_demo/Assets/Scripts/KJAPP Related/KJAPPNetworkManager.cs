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

public enum MatchReportAggregations
{
    average = 0,
    median
}

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
    /// Public method for starting the process of creating a match.
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
            StartCoroutine(POSTMatch(matchName));
        }

        if (matchReportsEnabled)
        {
            matchStartTime = Time.realtimeSinceStartup;
        }
    }

    /// <summary>
    /// Public method for starting the process of connecting to a match.
    /// Takes ip address and server port as parameters. 
    /// </summary>
    /// <param name="ip">The IP address we are connecting to.</param>
    /// <param name="port">The server port we are connecting to</param>
    public void StartClientConnection(string ip, int port)
    {
        networkAddress = ip;
        networkPort = port;

        StartClient();
    }

    /// <summary>
    /// Public method for starting the process of displaying matches. 
    /// </summary>
    /// <param name="filter">What type of filter we want to apply to the request.</param>
    /// <param name="callback">The callback that receives the array of matches.</param>
    /// <param name="withName">Default parameter that is set to "". Used whenever filter is set to GETRequestFilters.withName</param>
    public void RequestMatches(GETRequestFilters filter, System.Action<KJAPP.JSONObjects.Match.BaseResponse[]> callback, string withName = "")
    {
        StartCoroutine(GETMatches(filter, callback, withName));
    }

    /// <summary>
    /// Public method that can be called to request statistics from match report data. 
    /// Takes a enum representing the aggregation we want returned, a string representing the fieldName and a callback as parameters. 
    /// </summary>
    /// <param name="aggregationType">Enum representing the type of aggregation we want to retrieve.</param>
    /// <param name="fieldName">A string representing the name of the field we want to acquire statistics from.</param>
    /// <param name="callback">A callback taking a string as parameter, used to send the aggregated value back.</param>
    public void RequestAggregation(MatchReportAggregations aggregationType, string fieldName, System.Action<string> callback)
    {
        switch(aggregationType)
        {
            case MatchReportAggregations.average:
                StartCoroutine(GETMatchReportAverage(fieldName, callback));
                break;
            case MatchReportAggregations.median:
                StartCoroutine(GETMatchReportMedian(fieldName, callback));
                break;
            default:
                break;
        }
    }

    /// <summary>
    /// Public method that can be called to request statistics from match report data. 
    /// Takes a enum representing the aggregation we want returned, a string representing the fieldName and a callback as parameters. 
    /// This overloaded function is primarily made for convenience printing of data so that the callback has all the necessary information to know what it is printing. 
    /// </summary>
    /// <param name="aggregationType">Enum representing the type of aggregation we want to retrieve.</param>
    /// <param name="fieldName">A string representing the name of the field we want to acquire statistics from.</param>
    /// <param name="callback">A callback taking three parameters: the string representing the aggregated value, the type of aggregation done and the name of the field we aggregated.</param>
    public void RequestAggregation(MatchReportAggregations aggregationType, string fieldName, System.Action<string, MatchReportAggregations, string> callback)
    {
        switch (aggregationType)
        {
            case MatchReportAggregations.average:
                StartCoroutine(GETMatchReportAverage(fieldName, callback));
                break;
            case MatchReportAggregations.median:
                StartCoroutine(GETMatchReportMedian(fieldName, callback));
                break;
            default:
                break;
        }
    }
    #endregion

    #region Private Helper Methods
    /// <summary>
    /// Helper function for manually building web requests to avoid issues that might end up happening. 
    /// Unity doing things like url-encoding your body is one of these. 
    /// </summary>
    /// <param name="apiRouteAppendage">The part of the route to the API we want to append, example: "/match/"</param>
    /// <param name="jsonBody">The string containing the JSON object</param>
    /// <param name="requestType">Whether the request should be GET/POST/PUT etc</param>
    /// <returns>A web request that is ready for usage</returns>
    private UnityWebRequest CreateWebRequestWithBody(string apiRouteAppendage, string jsonBody, string requestType)
    {
        // Primarily made to solve: http://answers.unity3d.com/questions/1163204/prevent-unitywebrequestpost-from-url-encoding-the.html
        var webRequest = new UnityWebRequest(apiUrl + apiRouteAppendage);
        webRequest.uploadHandler = new UploadHandlerRaw(Encoding.ASCII.GetBytes(jsonBody));
        webRequest.downloadHandler = new DownloadHandlerBuffer();
        webRequest.method = requestType;
        webRequest.SetRequestHeader("Content-Type", "application/json");

        return webRequest;
    }

    /// <summary>
    /// Coroutine that fetches the external IP address before calling POSTMatch();
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
            StartCoroutine(POSTMatch(matchName));
        }
    }
    #endregion

    #region API Coroutines

    /// <summary>
    /// Coroutine that sends a web request to the API in order to create a new match.
    /// </summary>
    /// <param name="matchName">The name of the match we are POSTing.</param>
    private IEnumerator POSTMatch(string matchName)
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
            StartCoroutine(PUTMatchStatus(MATCH_STATUS_IN_SESSION));
            StartHost();

            // OpenNat will attempt to portforward for you, but there is no guarantee that it will work. 
            OpenNat.PortForward().Wait();
        }
    }


    /// <summary>
    /// Coroutine that sends a web request to the API in order to set the status of a match.
    /// Currently this is only used to set the status of a newly created match to in session.
    /// </summary>
    /// <param name="newStatus">The status int we want to update to.</param>
    private IEnumerator PUTMatchStatus(int newStatus)
    {
        var webRequest = CreateWebRequestWithBody("/match/status", 
                                                  JsonUtility.ToJson(new KJAPP.JSONObjects.Match.StatusPUTRequest(matchId, newStatus)), 
                                                  UnityWebRequest.kHttpVerbPUT);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API and receives a list of matches with given gameToken. 
    /// A filter is sent to specify what types of matches to GET.
    /// A callback is also sent which is used to send the retrieved matches back. 
    /// </summary>
    /// <param name="filter">The enum specifying how to filter the matches that are to be acquired.</param>
    /// <param name="callback">The callback we want to send the retrieved matches to</param>
    /// <param name="matchSearchName">The name of the match we want to search for in the case that filter is GETRequestFilters.byName</param>
    private IEnumerator GETMatches(GETRequestFilters filter, System.Action<KJAPP.JSONObjects.Match.BaseResponse[]> callback, string matchSearchName = "")
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
            callback(matches);
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API in order to delete the finished match. 
    /// </summary>
    private IEnumerator DELETEMatch()
    {
        var webRequest = CreateWebRequestWithBody("/match/", JsonUtility.ToJson(new KJAPP.JSONObjects.Match.DELETERequest(matchId)), UnityWebRequest.kHttpVerbDELETE);
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
    private IEnumerator PUTMatchPlayerCount()
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
    /// <param name="report">An object containing matchID, gameToken and a data object that can be of any type</param>
    private IEnumerator POSTMatchReport(object report)
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

    /// <summary>
    /// Coroutine that sends a GET request to the API to retrieve the average of a specified data field. 
    /// </summary>
    /// <param name="fieldName">The name of the field we want the average of.</param>
    /// <param name="callback">The callback we want to send the average to.</param>
    private IEnumerator GETMatchReportAverage(string fieldName, System.Action<string> callback)
    {
        var webRequest = UnityWebRequest.Get(apiUrl + "/match_reports/average/no_body/" + gameToken + "/" + fieldName);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            callback(jsonString);
        }
    }

    /// <summary>
    /// Coroutine that sends a GET request to the API to retrieve the median of a specified data field. 
    /// </summary>
    /// <param name="fieldName">The name of the field we want the median of.</param>
    /// <param name="callback">The callback we want to send the median to.</param>
    private IEnumerator GETMatchReportMedian(string fieldName, System.Action<string> callback)
    {
        var webRequest = UnityWebRequest.Get(apiUrl + "/match_reports/median/no_body/" + gameToken + "/" + fieldName);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            callback(jsonString);
        }
    }

    /// <summary>
    /// Coroutine that sends a GET request to the API to retrieve the average of a specified data field. 
    /// This overloaded function is primarily made for convenience printing of data so that the callback has all the necessary information to know what it is printing. 
    /// </summary>
    /// <param name="fieldName">The name of the field we want the average of.</param>
    /// <param name="callback">The callback we want to send the average to.</param>
    private IEnumerator GETMatchReportAverage(string fieldName, System.Action<string, MatchReportAggregations, string> callback)
    {
        var webRequest = UnityWebRequest.Get(apiUrl + "/match_reports/average/no_body/" + gameToken + "/" + fieldName);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            callback(jsonString, MatchReportAggregations.average, fieldName);
        }
    }

    /// <summary>
    /// Coroutine that sends a GET request to the API to retrieve the median of a specified data field. 
    /// This overloaded function is primarily made for convenience printing of data so that the callback has all the necessary information to know what it is printing. 
    /// </summary>
    /// <param name="fieldName">The name of the field we want the median of.</param>
    /// <param name="callback">The callback we want to send the median to.</param>
    private IEnumerator GETMatchReportMedian(string fieldName, System.Action<string, MatchReportAggregations, string> callback)
    {
        var webRequest = UnityWebRequest.Get(apiUrl + "/match_reports/median/no_body/" + gameToken + "/" + fieldName);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            callback(jsonString, MatchReportAggregations.median, fieldName);
        }
    }
    #endregion

    #region Callbacks
    /// <summary>
    /// NetworkManager callback that runs on the server whenever it stops.
    /// A finished match should be deleted from the database so this callback can be used to do so. 
    /// This callback also makes sure to send a match report to the API if this functionality is enabled. 
    /// </summary>
    public override void OnStopServer()
    {
        if (matchReportsEnabled)
        {
            StartCoroutine(POSTMatchReport(new ReportPOSTRequest(matchId,
                                                                 gameToken,
                                                                 new KJAPP.JSONObjects.Report.ExampleDataObject(GameManager.instance.score, (int)(Time.realtimeSinceStartup - matchStartTime)))));
        }

        StartCoroutine(DELETEMatch());
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
            StartCoroutine(PUTMatchPlayerCount());
        }
    }
    
    /// <summary>
    /// Callback that is called on the server whenever a client disconnects.
    /// We use this to update the player count of the match.
    /// </summary>
    public override void OnServerDisconnect(NetworkConnection conn)
    {
        playerCount--;
        StartCoroutine(PUTMatchPlayerCount());
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
