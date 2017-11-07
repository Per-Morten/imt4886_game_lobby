using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class Pickup : NetworkBehaviour {
    public GameObject visuals;
    public float rotationSpeed = 5;
    public int scoreValue = 10;

    private Vector3 rotationVector = Vector3.zero;

    private GameManager gameManager;
    private bool triggered = false;

    void Start()
    {
        gameManager = GameManager.instance;
    }

	void Update () {
        rotationVector.x += Time.deltaTime * rotationSpeed;
        rotationVector.y += Time.deltaTime * rotationSpeed;

        visuals.transform.Rotate(rotationVector);
        rotationVector = Vector3.zero;
	}

    [ServerCallback]
    void OnTriggerEnter(Collider other)
    {
        if (!triggered && other.CompareTag("Player"))
        {
            triggered = true;
            if (gameManager == null)
            {
                gameManager = GameManager.instance;
            }


            gameManager.score += scoreValue;
            gameManager.SpawnNewPickup();

            NetworkServer.Destroy(gameObject);
        }
    }
}
