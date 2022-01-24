import { Event } from './event';

export interface EventData {
    page: number;
    amount: number;
    total: number;
    alerts: Array<Event>;
  }
