[System.Serializable]
public class MatchResponse
{
    public string gameToken = null;
    public int status = -1;
    public string hostIP = null;
    public int hostPort = -1;
    public string _id = "";
    public int playerCount = -1;
}

[System.Serializable]
public class MatchPOSTRequest
{
    public string gameToken = null;
    public int status = -1;
    public string hostIP = null;
    public int hostPort = -1;
    public int playerCount = 1;

    public MatchPOSTRequest(string token, int status, string IP, int port)
    {
        gameToken = token;
        this.status = status;
        hostIP = IP;
        hostPort = port;
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
public class MatchesGETRequest
{
    public string gameToken = "";

    public MatchesGETRequest(string gToken)
    {
        gameToken = gToken;
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