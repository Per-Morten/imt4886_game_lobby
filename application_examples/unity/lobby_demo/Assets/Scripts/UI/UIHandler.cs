using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class UIHandler : MonoBehaviour
{
    [Header("Prefabs")]
    public GameObject matchButtonPrefab;
    public GameObject dynamicTextPrefab;

    [Header("Scene GameObjects")]
    public GameObject statisticsListObject;
    public GameObject matchListObject;

    [Header("Menus")]
    public GameObject waitForConnectionMenu;

    public GameObject rootMenu;
    private GameObject currentMenu;

    [Header("Input Fields")]
    public Text matchNameInput;

    [Header("Toggles")]
    public Toggle loopBackHostToggle;

    private KJAPPNetworkManager networkManager;

    void Start()
    {
        currentMenu = rootMenu;
        networkManager = NetworkManager.singleton.GetComponent<KJAPPNetworkManager>();
    }

    public void StartHost()
    {
        if (matchNameInput.text != null && matchNameInput.text != "")
        {
            networkManager.StartHosting(matchNameInput.text, loopBackHostToggle.isOn);
            ChangeMenu(waitForConnectionMenu);
        }
    }
    
    public void RequestMatches()
    {
        networkManager.RequestMatches(GETRequestFilters.noFilter, DisplayMatches);
    }

    public void RequestStatistics()
    {
        networkManager.RequestAggregation(MatchReportAggregations.average, "score", DisplayStatistic);
        networkManager.RequestAggregation(MatchReportAggregations.median, "score", DisplayStatistic);
        networkManager.RequestAggregation(MatchReportAggregations.average, "duration", DisplayStatistic);
        networkManager.RequestAggregation(MatchReportAggregations.median, "duration", DisplayStatistic);
    }

    public void ChangeMenu(GameObject newMenu)
    {
        currentMenu.SetActive(false);
        currentMenu = newMenu;
        currentMenu.SetActive(true);
    }

    public void DisplayMatches(KJAPP.JSONObjects.Match.BaseResponse[] matches)
    {
        foreach(var match in matches)
        {
            var matchButton = Instantiate(matchButtonPrefab, matchListObject.transform);
            matchButton.GetComponent<MatchButton>().Initialize(match, this);
        }
    }

    public void DisplayStatistic(string statisticsData, MatchReportAggregations aggregationType, string aggregatedFieldName)
    {
        var isAverage = aggregationType == MatchReportAggregations.average;
        var displayString = (isAverage ? "Average" : "Median") + " Match " + aggregatedFieldName + ": " + statisticsData + ((aggregatedFieldName == "duration") ? "s" : "");

        var newTextObject = Instantiate(dynamicTextPrefab, statisticsListObject.transform);
        newTextObject.GetComponent<Text>().text = displayString;
    }

    public void CleanUpChildren(GameObject parent)
    {
        foreach(Transform child in parent.transform)
        {
            Destroy(child.gameObject);
        }
    }
}
