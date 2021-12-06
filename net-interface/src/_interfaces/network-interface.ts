export interface NetworkInterface {
    ifIndex: string;
    ifDescr: string;
    ifType: string;
    ifMtu: string;
    ifSpeed: string;
    ifPhysAddress: string;
    ifAdminStatus: string;
    ifOperStatus: string;
    ifLastChange: string;
    ifInOctets: string;
    ifInUcastPkts: string;
    ifInNUcastPkts: string;
    ifInDiscards: string;
    ifInErrors: string;
    ifInUnknownProtos: string;
    ifOutOctets: string;
    ifOutUcastPkts: string;
    ifOutNUcastPkts: string;
    ifOutDiscards: string;
    ifOutErrors: string;
}
