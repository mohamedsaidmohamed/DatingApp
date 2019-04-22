import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor(private authservice : AuthService , private router: Router 
  , private alerify:AlertifyService) {}

  canActivate(): boolean {
    if(this.authservice.loggedIn()) {
      return true;
    }
    this.alerify.error('You are not allowed to access !!')
    this.router.navigate(['']);
    return false;
  }
}
