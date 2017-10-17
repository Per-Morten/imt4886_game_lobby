using UnityEngine;
using Open.Nat;
using System.Threading.Tasks;
using System.Text;
using System.Net;

// Based on https://stackoverflow.com/questions/40385993/unity-net-2-0-upnp-port-mapping
public static class OpenNat {
    public static Task PortForward()
    {
        var nat = new NatDiscoverer();
        var cts = new System.Threading.CancellationTokenSource();
        cts.CancelAfter(5000);

        NatDevice device = null;
        var sb = new StringBuilder();
        IPAddress ip = null;

        return nat.DiscoverDeviceAsync(PortMapper.Upnp, cts)
            .ContinueWith(task =>
            {
                device = task.Result;
                return device.GetExternalIPAsync();

            })
            .Unwrap()
            .ContinueWith(task =>
            {
                ip = task.Result;
                sb.AppendFormat("\nYour external IP: {0}", ip);
                return device.CreatePortMapAsync(new Mapping(Protocol.Tcp, UnityEngine.Networking.NetworkManager.singleton.networkPort, UnityEngine.Networking.NetworkManager.singleton.networkPort, 0, "Game Server (TCP)"));
            })
            .Unwrap()
            .ContinueWith(task =>
            {
                return device.CreatePortMapAsync(new Mapping(Protocol.Udp, UnityEngine.Networking.NetworkManager.singleton.networkPort, UnityEngine.Networking.NetworkManager.singleton.networkPort, 0, "Game Server (UDP)"));
            })
            .Unwrap()
            .ContinueWith(task =>
            {
                sb.AppendFormat("\nAdded mapping: {0}:{1} -> localIP:{1}\n", ip, UnityEngine.Networking.NetworkManager.singleton.networkPort);
                sb.AppendFormat("\n+------+-------------------------------+--------------------------------+------------------------------------+-------------------------+");
                sb.AppendFormat("\n| PROT | PUBLIC (Reacheable)           | PRIVATE (Your computer)        | Description                        |                         |");
                sb.AppendFormat("\n+------+----------------------+--------+-----------------------+--------+------------------------------------+-------------------------+");
                sb.AppendFormat("\n|      | IP Address           | Port   | IP Address            | Port   |                                    | Expires                 |");
                sb.AppendFormat("\n+------+----------------------+--------+-----------------------+--------+------------------------------------+-------------------------+");
                return device.GetAllMappingsAsync();
            })
            .Unwrap()
            .ContinueWith(task =>
            {
                foreach (var mapping in task.Result)
                {
                    sb.AppendFormat("\n|  {5} | {0,-20} | {1,6} | {2,-21} | {3,6} | {4,-35}|{6,25}|",
                        ip, mapping.PublicPort, mapping.PrivateIP, mapping.PrivatePort, mapping.Description,
                        mapping.Protocol == Protocol.Tcp ? "TCP" : "UDP", mapping.Expiration.ToLocalTime());
                }
                sb.AppendFormat("\n+------+----------------------+--------+-----------------------+--------+------------------------------------+-------------------------+");
                sb.AppendFormat("\n[Done]");
                Debug.Log(sb.ToString());
            });
    }
}
