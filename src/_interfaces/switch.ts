import { NetworkInterface } from './network-interface';

export interface Switch {
  isTwoPort: boolean;
  int1: NetworkInterface;
  int2: NetworkInterface;
}
