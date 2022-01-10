import { Service } from './service';
import { System } from './system';
import { NetworkInterface } from './network-interface';
import { IpAddress } from './ip-address';

export interface Feature {
    services: Service;
    system: System;
    interfaces: Array<any>;
    ipAddresses: Array<IpAddress>;
}
