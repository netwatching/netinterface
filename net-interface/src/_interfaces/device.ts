import { Time } from "@angular/common";
import { Timestamp } from "rxjs/internal/operators/timestamp";

export interface Device {
    _id: string;
    name: string;
    timestamp: string;
}
