using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class UIHandler : MonoBehaviour
{
    public GameObject matchButtonPrefab;

    public GameObject matchListMenu;
    public GameObject waitForConnectionMenu;

    public GameObject rootMenu;
    private GameObject currentMenu;

    void Start()
    {
        currentMenu = rootMenu;
    }

    public void StartHost()
    {
        NetworkManager.singleton.GetComponent<KJAPPNetworkManager>().StartHosting();
    }
    
    public void RequestMatches()
    {
        NetworkManager.singleton.GetComponent<KJAPPNetworkManager>().RequestMatches();
    }

    public void ChangeMenu(GameObject newMenu)
    {
        currentMenu.SetActive(false);
        currentMenu = newMenu;
        currentMenu.SetActive(true);
    }

    public void DisplayMatches(MatchResponse[] matches)
    {
        foreach(var match in matches)
        {
            var matchButton = Instantiate(matchButtonPrefab, matchListMenu.transform);
            matchButton.GetComponent<MatchButton>().Initialize(match.hostIP, match.hostPort, this);
        }
    }

    public void CleanUpMatchList()
    {
        foreach(Transform child in matchListMenu.transform)
        {
            Destroy(child.gameObject);
        }
    }
}
