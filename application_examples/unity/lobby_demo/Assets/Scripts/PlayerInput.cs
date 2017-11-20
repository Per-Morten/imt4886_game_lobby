using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class PlayerInput : NetworkBehaviour
{
    public float movementSpeed = 5;
    public string horizontalAxisName = "Horizontal";
    public string verticalAxisName = "Vertical";
    public Color localPlayerColor;

    private Vector3 movementDirection;
    private Rigidbody rbody;

    void Start()
    {
        rbody = GetComponent<Rigidbody>();

        if (!isLocalPlayer)
        {
            enabled = false;
            return;
        }

        GetComponent<MeshRenderer>().material.color = localPlayerColor;
    }

    void Update()
    {
        movementDirection = new Vector3(Input.GetAxis(horizontalAxisName), 0f, Input.GetAxis(verticalAxisName));

        if(Input.GetKeyDown(KeyCode.Escape))
        {
            NetworkManager.singleton.StopHost();
        }
    }

    void FixedUpdate()
    {
        rbody.AddForce(movementDirection * movementSpeed);
    }
}
