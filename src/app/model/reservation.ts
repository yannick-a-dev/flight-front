export interface Reservation {
  id?: number;
  reservationDate: Date | null;
  seatNumber: string;
  price: number;
  passengerId: number;
}