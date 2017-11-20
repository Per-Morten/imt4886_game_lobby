using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class MatchButton : MonoBehaviour {
    public Text matchNameText;
    public Text matchStatusText;
    public Text matchAddressText;
    public Text matchPlayerCountText;

    private KJAPP.JSONObjects.Match.BaseResponse match;
    private UIHandler uiHandler;

    public void Initialize(KJAPP.JSONObjects.Match.BaseResponse acquiredMatch, UIHandler uiHandlerReference)
    {
        match = acquiredMatch;
        uiHandler = uiHandlerReference;

        matchNameText.text = "Match Name: " + match.name;
        matchStatusText.text = "Match Status: " + ((match.status == 1) ? "In Progress" : "Not Started");
        matchAddressText.text = "Host Address: " + match.hostIP + "/" + match.hostPort;
        matchPlayerCountText.text = "Connected Players: " + match.playerCount + "/" + match.maxPlayerCount;
    }

    public void OnClick()
    {
        NetworkManager.singleton.GetComponent<KJAPPNetworkManager>().StartClientConnection(match.hostIP, match.hostPort);
        uiHandler.ChangeMenu(uiHandler.waitForConnectionMenu);
        uiHandler.CleanUpChildren(uiHandler.matchListObject);
    }
}
