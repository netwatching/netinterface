export interface NetworkInterface {
    index: number;
    description: string;
    type: string;
    mtu: number;
    speed: number;
    mac_address: string;
    admin_status: string;
    operating_status: string;
    last_change: number;
    in_bytes: number;
    in_unicast_packets: number;
    in_non_unicast_packets: number;
    in_discards: number;
    in_errors: number;
    in_unknown_protocolls: number;
    out_bytes: number;
    out_unicast_packets: number;
    out_non_unicast_packets: number;
    out_discards: number;
    out_errors: number;
}
