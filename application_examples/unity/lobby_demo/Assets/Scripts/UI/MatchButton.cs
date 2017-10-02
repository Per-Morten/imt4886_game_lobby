using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class MatchButton : MonoBehaviour {
    private string networkAddress;
    private int networkPort;

    private UIHandler uiHandler;

    public void Initialize(string ip, int port, UIHandler uiHandlerReference)
    {
        networkAddress = ip;
        networkPort = port;
        uiHandler = uiHandlerReference;

        GetComponentInChildren<Text>().text = networkAddress;
    }

    public void OnClick()
    {
        NetworkManager.singleton.GetComponent<KJAPPNetworkManager>().StartClientConnection(networkAddress, networkPort);
        uiHandler.ChangeMenu(uiHandler.waitForConnectionMenu);
        uiHandler.CleanUpMatchList();
    }
}
