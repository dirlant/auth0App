import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import auth0 from 'auth0-js';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  
  public options: Object = {
    allowedConnections:  ['twitter', 'facebook', 'linkedin'],
    rememberLastLogin: true,
    socialButtonStyle: "small",
    languageDictionary: {"title":"AuthApp"},
    language: "es",
    theme: {
      authButtons: {
        "testConnection": {
          displayName: "Test Conn",
          primaryColor: "#b7b7b7",
          foregroundColor: "#000000",
          icon: "http://example.com/icon.png"
        },
        "testConnection2": {
          primaryColor: "#000000",
          foregroundColor: "#ffffff",
        }
      }
    }
  }
  
  public lock = new Auth0Lock('U1EKkucHAytWaccwtwGAShXcevxawnvS', 'dirlant.auth0.com', this.options);

  auth0 = new auth0.WebAuth({
    clientID: 'U1EKkucHAytWaccwtwGAShXcevxawnvS',
    domain: 'dirlant.auth0.com',
    responseType: 'token id_token',
    audience: 'https://dirlant.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/callback',      
    scope: 'openid profile read:messages',
    
  });

  constructor(
    private router: Router
  ) {

  }

  userProfile: any;
  
  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }
  
    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/home']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}