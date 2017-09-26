[System.Serializable]
public class Match
{
    public string gameToken = null;
    public int status = -1;
    public string hostIP = null;
    public int hostPort = -1;
    public string id = null;

    public Match(string token, int status, string IP, int port)
    {
        gameToken = token;
        this.status = status;
        hostIP = IP;
        hostPort = port;
    }
}