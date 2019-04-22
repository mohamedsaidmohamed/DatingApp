import { Component, OnInit } from '@angular/core';
import { AuthService } from './_Services/Auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';

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
    if(dcodedToken){
      this.authService.dcodedToken = dcodedToken;
    }
  }

}

