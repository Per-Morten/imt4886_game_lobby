using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class GameManager : NetworkBehaviour {
    public static GameManager instance = null;

    [SyncVar]
    public int score = 0;

    public GameObject pickupSpawnPositionObjects;
    public GameObject pickupPrefab;

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

        DontDestroyOnLoad(gameObject);
    }

    public override void OnStartServer()
    {
        pickupSpawnPositions = pickupSpawnPositionObjects.GetComponentsInChildren<Transform>();
    }

    [ServerCallback]
    public void SpawnNewPickup()
    {
        var pickup = Instantiate(pickupPrefab, pickupSpawnPositions[Random.Range(0, pickupSpawnPositions.Length)].position, Quaternion.identity);
        NetworkServer.Spawn(pickup);
    }
}
