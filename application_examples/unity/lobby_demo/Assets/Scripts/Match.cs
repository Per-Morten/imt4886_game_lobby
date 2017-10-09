[System.Serializable]
public class MatchResponse
{
    public string name = null;
    public string gameToken = null;
    public int status = -1;
    public string hostIP = null;
    public int hostPort = -1;
    public string _id = null;
    public int playerCount = -1;
    public int maxPlayerCount = -1;
}

[System.Serializable]
public class MatchPOSTRequest
{
    public string name = null;
    public string gameToken = null;
    public int status = -1;
    public string hostIP = null;
    public int hostPort = -1;
    public int playerCount = 1;
    public int maxPlayerCount = 1;

    public MatchPOSTRequest(string name, string gameToken, int status, string hostIP, int hostPort, int playerCount, int maxPlayerCount)
    {
        this.name = name;
        this.gameToken = gameToken;
        this.status = status;
        this.hostIP = hostIP;
        this.hostPort = hostPort;
        this.playerCount = playerCount;
        this.maxPlayerCount = maxPlayerCount;
    }
}

[System.Serializable]
public class MatchStatusPUTRequest
{
    public string id = "";
    public int status = -1;

    public MatchStatusPUTRequest(string id, int status)
    {
        this.id = id;
        this.status = status;
    }
}

[System.Serializable]
public class MatchDeleteRequest
{
    public string id = "";

    public MatchDeleteRequest(string id)
    {
        this.id = id;
    }
}