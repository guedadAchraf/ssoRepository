import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { UserProfile } from './auth/user.model';
import { Observable, Subscription } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import {KeycloakAuthService} from "./auth/keycloak-auth.service";
import {KeycloakProfile} from "keycloak-js";


interface AuthState {
  isLoggedIn: boolean;
  username: string;
  error?: string;
}






@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  authState: AuthState = {
    isLoggedIn: false,
    username: ''
  };

  private subscriptions: Subscription = new Subscription();

  constructor(private authService: KeycloakAuthService) {}

  ngOnInit(): void {
    this.updateAuthState();
  }

  private updateAuthState(): void {
    // Directly use the isLoggedIn method since it returns a boolean
    this.authState.isLoggedIn = this.authService.isLoggedIn();
    if (this.authState.isLoggedIn) {
      this.loadUserProfile(); // Load the user profile if logged in
    }

    if(this.authService.isLoggedIn()){
      window.location.href = 'http://localhost:4201';

    }



  }

  private loadUserProfile(): void {
    this.subscriptions.add(
      this.authService.getUserProfile().subscribe(
        (profile: KeycloakProfile) => {
          this.authState.username = profile.username ?? '';
        },
        (error) => this.handleError(error, 'Error loading user profile')
      )
    );
  }

  login(): void {
    this.authService.login().subscribe(
      () => this.updateAuthState(),
      (error) => this.handleError(error, 'Login failed')
    );
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        this.authState = {
          isLoggedIn: false,
          username: ''
        };
      },
      (error) => this.handleError(error, 'Logout failed')
    );
  }

  private handleError(error: unknown, defaultMessage: string): void {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    this.authState.error = errorMessage;
    console.error(errorMessage, error);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up subscriptions on destroy
  }
}
