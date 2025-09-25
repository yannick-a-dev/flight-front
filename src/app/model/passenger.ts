import { Alert } from "./alert";

export interface Passenger {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passportNumber: string;
    dob: string;
    enabled: boolean;
    alerts: Alert[];
    flightNumbers?:string[];
  }
  