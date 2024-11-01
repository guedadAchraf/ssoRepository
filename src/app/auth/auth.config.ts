import {AuthConfig} from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8180/realms/sso-realm',
  clientId: 'angular-app-1',
  responseType: 'code',
  scope: 'openid profile email',
  requireHttps: false, // Set to true in production
  showDebugInformation: true, // Set to false in production
  strictDiscoveryDocumentValidation: false,
  skipIssuerCheck: true,
  redirectUri: window.location.origin + '/',
  // Additional recommended configurations
 /* useSilentRefresh: true,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  silentRefreshTimeout: 5000,
  timeoutFactor: 0.75,
  sessionChecksEnabled: true,
  clearHashAfterLogin: true,
  disableAtHashCheck: false*/
};
