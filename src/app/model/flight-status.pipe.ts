import { Pipe, PipeTransform } from '@angular/core';
import { FlightStatus } from './flight-status';

@Pipe({
  name: 'flightStatus',
  standalone: false
})
export class FlightStatusPipe implements PipeTransform {
  transform(value: FlightStatus): string {
    // Retourner une version lisible du statut
    switch (value) {
      case FlightStatus.ON_TIME:
        return 'On Time';
      case FlightStatus.CANCELLED:
        return 'Cancelled';
      case FlightStatus.DELAYED:
        return 'Delayed';
      case FlightStatus.BOARDING:
        return 'Boarding';
      case FlightStatus.LANDED:
        return 'Landed';
      default:
        return 'Unknown Status';
    }
  }
}
