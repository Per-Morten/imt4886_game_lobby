
namespace KJAPP
{
    namespace JSONObjects
    {
        namespace Match
        {
            /// <summary>
            /// BaseResponse is the default response acquired from GET requests and the return of POST requests. 
            /// </summary>
            [System.Serializable]
            public class BaseResponse
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
            public class POSTRequest
            {
                public string name = null;
                public string gameToken = null;
                public string hostIP = null;
                public int hostPort = -1;
                public int maxPlayerCount = 1;

                public POSTRequest(string name, string gameToken, string hostIP, int hostPort, int maxPlayerCount)
                {
                    this.name = name;
                    this.gameToken = gameToken;
                    this.hostIP = hostIP;
                    this.hostPort = hostPort;
                    this.maxPlayerCount = maxPlayerCount;
                }
            }

            [System.Serializable]
            public class StatusPUTRequest
            {
                public string id = "";
                public int status = -1;

                public StatusPUTRequest(string id, int status)
                {
                    this.id = id;
                    this.status = status;
                }
            }

            [System.Serializable]
            public class DELETERequest
            {
                public string id = "";

                public DELETERequest(string id)
                {
                    this.id = id;
                }
            }

            [System.Serializable]
            public class PlayerCountPUTRequest
            {
                public string id = "";
                public int playerCount = -1;

                public PlayerCountPUTRequest(string id, int playerCount)
                {
                    this.id = id;
                    this.playerCount = playerCount;
                }
            }
        }

        namespace Report
        {
            /// <summary>
            /// Example Data Object which is used for match reports. These can include serializable data types for archiving in the report database. 
            /// </summary>
            [System.Serializable]
            class ExampleDataObject
            {
                public int score = -1;
                public int duration = -1;

                public ExampleDataObject(int score, int duration)
                {
                    this.score = score;
                    this.duration = duration;
                }
            }
        }
    }
}