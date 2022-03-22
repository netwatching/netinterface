import { Time } from "@angular/common";
import { Timestamp } from "rxjs/internal/operators/timestamp";

export interface Device {
    id: string;
    category_id: string;
    hostname: string;
    category: string;
}
