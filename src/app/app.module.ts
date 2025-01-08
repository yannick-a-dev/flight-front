import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { HomeComponent } from './components/home/home.component'; 
import { MatDialogModule } from '@angular/material/dialog';
import { UpdatePassengerComponent } from './components/update-passenger/update-passenger.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AlertsComponent } from './components/alert/alert.component';
import { MatSelectModule } from '@angular/material/select';
import { AlerteDetailComponent } from './components/alerte-detail/alerte-detail.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlightComponent } from './components/flight/flight.component';
import { FlightDialogComponent } from './components/flight-dialog/flight-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { FlightStatusPipe } from './model/flight-status.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UpdatePassengerComponent,
    AlertsComponent,
    AlerteDetailComponent,
    AlertListComponent,
    FlightComponent,
    FlightDialogComponent,
    FlightStatusPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule, 
    MatFormFieldModule,   
    MatInputModule,      
    MatButtonModule,  
    MatSnackBarModule,    
    HttpClientModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    MatListModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  providers: [
    provideAnimationsAsync(),
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
