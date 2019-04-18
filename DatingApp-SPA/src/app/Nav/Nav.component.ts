import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { RSA_PKCS1_OAEP_PADDING } from 'constants';

@Component({
  selector: 'app-Nav',
  templateUrl: './Nav.component.html',
  styleUrls: ['./Nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(private authService: AuthService) { }
  ngOnInit(){ 
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      console.log ('Logged in succesfully!');
    }, error => {
      console.log('Failed to login!');
    });

  }
loggedIn(){
  const token = localStorage.getItem('token');
  return !!token;
}

Logout(){
  localStorage.removeItem('token');
  console.log('logged out');
}
}
