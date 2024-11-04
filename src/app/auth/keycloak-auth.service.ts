import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import {Observable, from, of, tap} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {
  constructor(private readonly keycloak: KeycloakService) {}

  public init(): Observable<boolean> {
    return from(this.keycloak.init({
      config: {
        url: 'http://localhost:8180',
        realm: 'sso-realm',
        clientId: 'angular-app-1'
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false
      },
      enableBearerInterceptor: true
    })).pipe(
      catchError((error: unknown) => {
        console.error('Error initializing Keycloak:', error);
        return of(false);
      })
    );
  }

  public login(): Observable<void> {
    return from(this.keycloak.login()).pipe(
      catchError((error: unknown) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  public logout(): Observable<void> {
    return from(this.keycloak.logout()).pipe(
      catchError((error: unknown) => {
        console.error('Logout error:', error);
        throw error;
      })
    );
  }

  public isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  public getUserProfile(): Observable<KeycloakProfile> {
    return from(this.keycloak.loadUserProfile()).pipe(
      catchError((error: unknown) => {
        console.error('Error loading user profile:', error);
        throw error;
      })
    );
  }

  // Method to log in, generate a token, and store it in local storage
  public loginAndStoreToken(): Observable<void> {
    return from(this.keycloak.login()).pipe(
      tap(async () => {
        // After successful login, get the token
        const token = await this.keycloak.getToken();
        // Store the token in local storage
        localStorage.setItem('token', token);
        console.log('Token stored in local storage:', token);
      }),
      catchError((error: unknown) => {
        console.error('Login error:', error);
        throw error;
      })


    );
  }




  public getToken(){

    return this.keycloak.getToken();
  }



























}
