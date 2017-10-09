using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class UIHandler : MonoBehaviour
{
    public GameObject matchButtonPrefab;

    [Header("Menus")]
    public GameObject matchListMenu;
    public GameObject waitForConnectionMenu;

    public GameObject rootMenu;
    private GameObject currentMenu;

    [Header("Input Fields")]
    public Text matchNameInput;

    void Start()
    {
        currentMenu = rootMenu;
    }

    public void StartHost()
    {
        if (matchNameInput.text != null && matchNameInput.text != "")
        {
            NetworkManager.singleton.GetComponent<KJAPPNetworkManager>().StartHosting(matchNameInput.text);
        }
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
            matchButton.GetComponent<MatchButton>().Initialize(match, this);
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
