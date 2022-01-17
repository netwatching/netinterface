export interface Event {
  device: string;
  Alert: {
    timestamp: string;
    device_id: number;
    problem: string;
    id: number;
    severity: number;
  }
}
