import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { UpdatePassengerComponent } from './components/update-passenger/update-passenger.component';
import { AlertsComponent } from './components/alert/alert.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { AlerteDetailComponent } from './components/alerte-detail/alerte-detail.component';
import { FlightComponent } from './components/flight/flight.component';
import { AirportListComponent } from './components/airport-list/airport-list.component';
import { AirportEditComponent } from './components/airport-edit/airport-edit.component';
import { AlertFormComponent } from './components/alert-form/alert-form.component';
import { ReservationFormComponent } from './components/reservation-form/reservation-form.component';
import { FlightDetailComponent } from './components/flight-detail/flight-detail.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';


const routes: Routes = [
  // Auth
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },

  // Home
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  // Passagers
  { path: 'update-passenger/:id', component: UpdatePassengerComponent },

  // Vols
  { path: 'home/flights', component: FlightComponent },
  { path: 'home/flights/:flightNumber', component: FlightDetailComponent },
  { path: 'flights/:flightNumber/alerts', component: AlertListComponent },
  { path: 'flights/:flightNumber/reservations/new', component: ReservationFormComponent },
  { path: 'flights/:flightNumber/alerts/new', component: AlertFormComponent },

  // Réservations
  { path: 'reservations/add', component: ReservationFormComponent },

  // Alertes
  { path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] },
  { path: 'alerts/add', component: AlertFormComponent },
  { path: 'create-alert/:id', component: AlertsComponent },
  { path: 'alerte-detail/:id', component: AlerteDetailComponent },
  { path: 'alert-list', component: AlertListComponent, canActivate: [AuthGuard] },
  { path: 'liste-des-alertes', component: AlertListComponent },

  // Aéroports
  { path: 'home/airports', component: AirportListComponent },
  { path: 'edit-airport/:id', component: AirportEditComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
