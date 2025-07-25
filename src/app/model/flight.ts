import { Alert } from "./alert";
import { FlightStatus } from "./flight-status";
import { Reservation } from "./reservation";

export interface Flight {
  id?: number; 
  flightNumber: string;
  departureTime: string; 
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  status: FlightStatus;
  reservations: Reservation[];
  alerts: Alert[];
}