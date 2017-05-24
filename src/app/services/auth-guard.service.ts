import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private Router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    
    if (this.auth.isAuthenticated()) {
      console.log('El guard paso');
      return true;
      
    } else {
      console.error('Bloqueado por el guard');
      this.Router.navigate(['/home']);  
      return true;
      
    }

  }

}
