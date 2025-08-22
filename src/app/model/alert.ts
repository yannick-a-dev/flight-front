export interface Alert {
  id: number;
  message: string;
  alertDate: Date | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  passengerId: number;
  flightNumber: string;
}
