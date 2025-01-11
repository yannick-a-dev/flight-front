import { FlightStatus } from "./flight-status";
import { Reservation } from "./reservation";

export interface Flight {
    id: number;
    flightNumber: string;
    departureTime: string;  
    arrivalTime: string;    
    departureFlightIds?: string[];  
    arrivalFlightIds?: string[]; 
    status: FlightStatus;
    reservations: Reservation[]; 
}
