import { Device } from './device';

export interface DeviceData {
    page: number;
    amount: number;
    total: number;
    devices: Array<Device>;
}
