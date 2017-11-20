using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class GameManager : NetworkBehaviour {
    public static GameManager instance = null;

    [SyncVar(hook = "OnScoreChange")]
    public int score = 0;

    public GameObject pickupSpawnPositionObjects;
    public GameObject pickupPrefab;
    public Text scoreText;

    private Transform[] pickupSpawnPositions;

    void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
        else if (instance != this)
        {
            Destroy(gameObject);
        }
    }

    public override void OnStartServer()
    {
        pickupSpawnPositions = pickupSpawnPositionObjects.GetComponentsInChildren<Transform>();
    }

    public override void OnStartClient()
    {
        OnScoreChange(score);
    }

    [ServerCallback]
    public void SpawnNewPickup()
    {
        var pickup = Instantiate(pickupPrefab, pickupSpawnPositions[Random.Range(0, pickupSpawnPositions.Length)].position, Quaternion.identity);
        NetworkServer.Spawn(pickup);
    }

    private void OnScoreChange(int newScore)
    {
        score = newScore;
        scoreText.text = "Score: " + score.ToString();
    }
}
