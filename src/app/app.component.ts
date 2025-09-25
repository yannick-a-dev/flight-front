import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentRoute: string = '';
  isLoggedIn = false;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });

    // Souscrire au BehaviorSubject pour mettre à jour le template automatiquement
    this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

   get isRegisterPage(): boolean {
    return this.router.url === '/register';
  }

  
  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
