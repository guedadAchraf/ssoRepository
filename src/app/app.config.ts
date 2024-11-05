import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {OAuthModule} from "angular-oauth2-oidc";
import {provideHttpClient} from "@angular/common/http";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {KeycloakAuthService} from "./auth/keycloak-auth.service";
import {firstValueFrom} from "rxjs";



function initializeKeycloak(keycloak: KeycloakAuthService) {
  return () => keycloak.init();
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),

    importProvidersFrom(
      OAuthModule.forRoot()), provideHttpClient(),
    importProvidersFrom(KeycloakAngularModule),
    KeycloakService,
    KeycloakAuthService,
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakAuthService]

    }
  ]
};
