using System.Collections;
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
        var matchPOSTData = new MatchPOST(gameToken, 0, networkAddress, networkPort);

        // https://forum.unity.com/threads/unitywebrequest-post-url-jsondata-sending-broken-json.414708/
        // The postData the POST request is empty as the API call takes the JSON string into its route.
        var webRequest = UnityWebRequest.Post(apiUrl + "/match/" + (JsonUtility.ToJson(matchPOSTData) ?? ""), "");
        webRequest.SetRequestHeader("Content-Type", "application/json");
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        } 
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            matchId = JsonUtility.FromJson<Match>(jsonString)._id;
            StartCoroutine(SetMatchStatusToInSession());
            StartHost();
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API in order to set the status to the newly created match as in session. 
    /// </summary>
    private IEnumerator SetMatchStatusToInSession()
    {
        // This is a hack because Unity will not allow you to do PUT web requests with empty payload data, although this is allowed for POST requests.
        var webRequest = UnityWebRequest.Post(apiUrl + "/match/" + matchId + "/" + MATCH_ACTIVE_STATUS, "");
        webRequest.method = "PUT";
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
        // https://docs.unity3d.com/Manual/UnityWebRequest-RetrievingTextBinaryData.html
        var webRequest = UnityWebRequest.Get(apiUrl + "/matches/" + gameToken);

        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            var jsonString = webRequest.downloadHandler.text;
            var matches = JsonHelper.getJsonArray<Match>(jsonString);
            GameObject.FindGameObjectWithTag("UIHandler").GetComponent<UIHandler>().DisplayMatches(matches);
        }
    }

    /// <summary>
    /// Coroutine that sends a web request to the API in order to delete the finished match. 
    /// </summary>
    private IEnumerator DeleteMatch()
    {
        var webRequest = UnityWebRequest.Delete(apiUrl + "/match/" + matchId);
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
}
