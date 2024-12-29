import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Passenger } from '../../model/model';
import { PassengerService } from '../../services/passenger.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-passenger',
  standalone: false,
  
  templateUrl: './update-passenger.component.html',
  styleUrl: './update-passenger.component.scss'
})
export class UpdatePassengerComponent implements OnInit {
  updateForm: FormGroup;
  passengerId: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private passengerService: PassengerService // Service pour récupérer les données du passager
  ) {
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      passportNumber: ['', Validators.required],
      dob: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    // Récupérer l'ID du passager depuis l'URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      // Vérification si l'ID existe et est un nombre valide
      if (id && !isNaN(+id)) {
        this.passengerId = +id; // Convertir en nombre
        this.getPassengerDetails(); // Récupérer les détails du passager
      } else {
        console.error('Invalid or missing passenger ID');
        // Gérer l'erreur (rediriger, afficher un message, etc.)
      }
    });
  }

  getPassengerDetails(): void {
    this.passengerService.getPassengerById(this.passengerId).subscribe(
      data => {
        console.log('Passenger data received:', data);  // Afficher les données du passager dans la console
        this.updateForm.patchValue(data); // Pré-remplir le formulaire avec les données du passager
        console.log('Form values after patchValue:', this.updateForm.value);  // Vérifier les valeurs dans le formulaire
      },
      error => {
        console.error('Error fetching passenger details', error);
      }
    );
  }
  

  onSubmit(): void {
    if (this.updateForm.valid) {
      // Appeler un service pour mettre à jour le passager
      this.passengerService.updatePassenger(this.passengerId, this.updateForm.value).subscribe(
        response => {
          console.log('Passenger updated successfully');
        },
        error => {
          console.error('Error updating passenger', error);
        }
      );
    }
  }
}