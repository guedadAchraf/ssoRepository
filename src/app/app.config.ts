import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {OAuthModule} from "angular-oauth2-oidc";
import {provideHttpClient} from "@angular/common/http";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {KeycloakAuthService} from "./auth/keycloak-auth.service";
import {firstValueFrom} from "rxjs";

function initializeKeycloak(keycloakAuthService: KeycloakAuthService) {
  return (): Promise<boolean> => firstValueFrom(keycloakAuthService.init());
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),

    importProvidersFrom(
    OAuthModule.forRoot()), provideHttpClient(),
    importProvidersFrom(KeycloakAngularModule),
    KeycloakService,
    KeycloakAuthService,
    importProvidersFrom(KeycloakAuthService),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakAuthService],
      multi: true
    }
  ]
};
