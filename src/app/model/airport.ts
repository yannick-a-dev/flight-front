export interface Airport {
    id: number;                 
    name: string;               
    location: string;           
    code: string;       
    city: string; 
    country: string;       
    departureFlightIds?: string[]; 
    arrivalFlightIds?: string[];  
  }