import { Reservation } from "./reservation";

export interface Flight {
    id: number;
    flightNumber: string;
    departureTime: string;  
    arrivalTime: string;    
    departureAirport: string;
    arrivalAirport: string;
    status: string;
    reservations: Reservation[]; 
}
