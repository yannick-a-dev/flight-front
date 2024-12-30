import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PassengerService } from '../../services/passenger.service';
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
    private passengerService: PassengerService,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      passportNumber: ['', Validators.required],
      dob: ['', [Validators.required, this.validateDate]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !isNaN(+id)) {
        this.passengerId = +id;
        this.getPassengerDetails();
      } else {
        console.error('Invalid or missing passenger ID');
      }
    });
  }

  // Custom validator for date format
  validateDate(control: AbstractControl): { [key: string]: any } | null {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;  // Matches yyyy-MM-dd format
    return dateRegex.test(control.value) ? null : { invalidDate: true };
  }

  // Fetch passenger details
  getPassengerDetails(): void {
    this.passengerService.getPassengerById(this.passengerId).subscribe(
      data => {
        console.log('Passenger data received:', data);
        this.updateForm.patchValue(data);
        console.log('Form values after patchValue:', this.updateForm.value);
      },
      error => {
        console.error('Error fetching passenger details', error);
      }
    );
  }

  // Handle form submission
  onSubmit(): void {
    if (this.updateForm.valid) {
      const formData = { ...this.updateForm.value };

      // Ensure dob is formatted correctly before submitting
      if (formData.dob) {
        formData.dob = new Date(formData.dob).toISOString().split('T')[0];
      }

      this.passengerService.updatePassenger(this.passengerId, formData).subscribe(
        response => {
          console.log('Passenger updated successfully');
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Error updating passenger', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}