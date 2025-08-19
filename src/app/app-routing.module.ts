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

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'update-passenger/:id', component: UpdatePassengerComponent },
  { path: 'home/flights', component: FlightComponent },
  { path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] },
  { path: 'alert-list', component: AlertListComponent, canActivate: [AuthGuard] },
  { path: 'liste-des-alertes', component: AlertListComponent }, 
  { path: 'create-alert/:id', component: AlertsComponent },
  { path: 'alerte-detail/:id', component: AlerteDetailComponent },
  { path: 'home/airports', component: AirportListComponent},
  { path: 'edit-airport/:id', component: AirportEditComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:  'reservations/add', component:ReservationFormComponent},
  {path:  'alerts/add', component:AlertFormComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
