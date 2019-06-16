import { Component, OnInit } from '@angular/core';
import { AuthService } from './_Services/Auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from './_models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  title = 'DatingApp-SPA';
  JWTHelper = new  JwtHelperService();
  constructor(private authService : AuthService) {}

  ngOnInit(): void {
    const dcodedToken = this.authService.getDecodedToken();
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (dcodedToken) {
      this.authService.dcodedToken = dcodedToken;
    }
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
    }
  }

}

