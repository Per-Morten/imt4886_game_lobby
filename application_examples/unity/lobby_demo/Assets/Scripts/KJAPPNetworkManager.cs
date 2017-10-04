using System.Collections;
using System.Text;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class KJAPPNetworkManager : NetworkManager
{
    [Header("KJAPP specific")]
    public string gameToken;
    public string apiUrl;

    private string matchId = "";
    private const int MATCH_ACTIVE_STATUS = 1;

    /// <summary>
    /// Public method that can be called by a button on the UI(as an example) in order to start the process creating a match.
    /// </summary>
    public void StartHosting()
    {
        StartCoroutine(UploadMatch());
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

    /// <summary>
    /// Coroutine that sends a web request to the API in order to create a new match. 
    /// </summary>
    private IEnumerator UploadMatch()
    {
        var webRequest = CreateWebRequest("/match/", JsonUtility.ToJson(new MatchPOSTRequest(gameToken, 0, networkAddress, networkPort)), UnityWebRequest.kHttpVerbPOST);
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
        var webRequest = CreateWebRequest("/match/status", JsonUtility.ToJson(new MatchStatusPUTRequest(matchId, MATCH_ACTIVE_STATUS)), UnityWebRequest.kHttpVerbPUT);
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
        // As a note: the body-parser used on the server seems to completely ignore GET requests with bodies, so GET requests need to be reworked. 
        var webRequest = CreateWebRequest("/matches/", JsonUtility.ToJson(new MatchesGETRequest(gameToken)), UnityWebRequest.kHttpVerbGET);
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
        var webRequest = CreateWebRequest("/match/", JsonUtility.ToJson(new MatchDeleteRequest(matchId)), UnityWebRequest.kHttpVerbDELETE);
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
    }

    /// <summary>
    /// NetworkManager callback that runs whenever StopHost() is called.
    /// A finished match should be deleted from the database so this callback can be used to do so. 
    /// </summary>
    public override void OnStopHost()
    {
        base.OnStopHost();

        // Rather lengthy way of checking that we are the server.
        if (client.connection.playerControllers[0].gameObject.GetComponent<NetworkIdentity>().isServer)
        {
            StartCoroutine(DeleteMatch());
        }
    }

    /// <summary>
    /// Helper function for manually building web requests to avoid issues that you might end up having from Unity doing things like url-encoding your body. 
    /// </summary>
    /// <param name="apiRouteAppendage">The part of the route to the API we want to append, example: "/match/"</param>
    /// <param name="jsonBody">The string containing the JSON object</param>
    /// <param name="requestType">Whether the request should be GET/POST/PUT etc</param>
    /// <returns>A web request that is ready for usage</returns>
    private UnityWebRequest CreateWebRequest(string apiRouteAppendage, string jsonBody, string requestType)
    {
        // http://answers.unity3d.com/questions/1163204/prevent-unitywebrequestpost-from-url-encoding-the.html
        var webRequest = new UnityWebRequest(apiUrl + apiRouteAppendage);
        webRequest.uploadHandler = new UploadHandlerRaw(Encoding.ASCII.GetBytes(jsonBody));
        webRequest.downloadHandler = new DownloadHandlerBuffer();
        webRequest.method = requestType;
        webRequest.SetRequestHeader("Content-Type", "application/json");

        return webRequest;
    }
}
