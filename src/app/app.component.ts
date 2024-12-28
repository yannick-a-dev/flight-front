import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suivre les changements de route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects; // Met à jour currentRoute lors de chaque changement de route
      }
    });
  }

  // Logique pour revenir en arrière
  goBack(): void {
    window.history.back(); // Utilisation de l'historique du navigateur pour revenir en arrière
  }
}
