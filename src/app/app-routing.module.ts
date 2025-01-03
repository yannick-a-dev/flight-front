import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { UpdatePassengerComponent } from './components/update-passenger/update-passenger.component';
import { AlertsComponent } from './components/alert/alert.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { AlerteDetailComponent } from './components/alerte-detail/alerte-detail.component';
import { FlightComponent } from './components/flight/flight.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'update-passenger/:id', component: UpdatePassengerComponent },
  { path: 'home/flights', component: FlightComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] },
  { path: 'alert-list', component: AlertListComponent, canActivate: [AuthGuard] },
  { path: 'liste-des-alertes', component: AlertListComponent }, 
  { path: 'alerte-detail/:id', component: AlerteDetailComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
