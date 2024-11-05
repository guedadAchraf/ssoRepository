import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { UserProfile } from './auth/user.model';
import {from, Observable, of, Subscription, tap} from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import {KeycloakAuthService} from "./auth/keycloak-auth.service";
import {KeycloakProfile} from "keycloak-js";
import {catchError} from "rxjs/operators";


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
  private token : any;
  constructor(private authService: KeycloakAuthService) {}

  ngOnInit(): void {
    //this.getTokenFromLocalStorage();
    //console.log(this.getTokenFromLocalStorage());
   // this.updateAuthState();
  }

  public getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token'); // Adjust 'token' to your actual key used for storing the token
  }

  // Make sure updateAuthState and loadUserProfile are defined as before
  private updateAuthState(): void {
    // Directly use the isLoggedIn method since it returns a boolean
    this.authState.isLoggedIn = this.authService.isLoggedIn();
    if (this.authState.isLoggedIn==true ) {
      this.loadUserProfile(); // Load the user profile if logged in
    }

    if(this.loadUserProfile()) {
      window.location.href = 'http://localhost:4202';
    }
    }

  private loadUserProfile(): Observable<void> {
    return new Observable((observer) => {
      this.subscriptions.add(
        this.authService.getUserProfile().subscribe(
          (profile: KeycloakProfile) => {
            this.authState.username = profile.username ?? '';
            observer.next();
            observer.complete();
          },
          (error) => {
            this.handleError(error, 'Error loading user profile');
            observer.error(error);
          }
        )
      );
    });
  }

  // In your KeycloakAuthService
    public login(){
    this.authService.login();
    }
  public async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
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

  function handleError(error: any) {

  }

