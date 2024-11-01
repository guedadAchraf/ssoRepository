
import { OAuthService } from 'angular-oauth2-oidc';
import {authConfig} from "./auth.config";
import {UserProfile} from "./user.model";
import {Injectable} from "@angular/core";


@Injectable({ providedIn: 'root' })
export class AuthService {


  constructor(private oauthService: OAuthService) {
    this.configure(); // Configure OAuth on service initialization
  }



  private configure() {
    this.oauthService.configure(authConfig);

    // Add these debug lines
    this.oauthService.events.subscribe(event => {
      console.log('OAuth event:', event);
    });

    this.oauthService.loadDiscoveryDocument()
      .then(() => {
        console.log('Discovery document loaded');
        console.log('Issuer:', authConfig.issuer);
        this.oauthService.tryLoginCodeFlow();
      })
      .catch(error => {
        console.error('Error loading discovery document:', error);
      });
  }

}
