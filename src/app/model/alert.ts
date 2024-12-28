export interface Alert {
    id: number;
    message: string;
    alertDate: Date;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    passengerId: number;
    flightId: number;
  }
  