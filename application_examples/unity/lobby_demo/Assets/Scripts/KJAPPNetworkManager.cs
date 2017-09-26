using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class KJAPPNetworkManager : NetworkManager
{
    [Header("KJAPP specific")]
    public string gameToken;
    public string apiUrl;

    public void StartHosting()
    {
        StartCoroutine(UploadMatch());
    }

    public void StartClientConnection(string ip, int port)
    {
        networkAddress = ip;
        networkPort = port;

        StartClient();
    }

    public void RequestMatches()
    {
        StartCoroutine(FetchMatches());
    }

    private IEnumerator UploadMatch()
    {
        Match matchPOSTData = new Match(gameToken, 0, networkAddress, networkPort);

        // https://forum.unity.com/threads/unitywebrequest-post-url-jsondata-sending-broken-json.414708/
        UnityWebRequest webRequest = UnityWebRequest.Put(apiUrl + "/Match/" + gameToken, JsonUtility.ToJson(matchPOSTData) ?? "");
        webRequest.SetRequestHeader("Content-Type", "application/json");
        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        } 
        else
        {
            StartHost();
        }
    }

    private IEnumerator FetchMatches()
    {
        // https://docs.unity3d.com/Manual/UnityWebRequest-RetrievingTextBinaryData.html
        UnityWebRequest webRequest = UnityWebRequest.Get(apiUrl + "/Matches/" + gameToken);

        yield return webRequest.Send();

        if (webRequest.isNetworkError)
        {
            Debug.Log(webRequest.error);
        }
        else
        {
            string jsonString = webRequest.downloadHandler.text;
            Match[] matches = JsonHelper.getJsonArray<Match>(jsonString);
            GameObject.FindGameObjectWithTag("UIHandler").GetComponent<UIHandler>().DisplayMatches(matches);
        }
    }
}
