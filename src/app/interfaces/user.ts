import { Time } from "@angular/common";

export interface User {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  isMale: boolean;
  birthdate: Date;
  department: string;
  location: GeolocationPosition;
  type:number,
  entryTime:Date;
  departureTime:Date;
  expiredTime:number
}
