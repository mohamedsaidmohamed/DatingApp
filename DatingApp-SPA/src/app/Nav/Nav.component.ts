import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';

@Component({
  selector: 'app-Nav',
  templateUrl: './Nav.component.html',
  styleUrls: ['./Nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public authService: AuthService, private alerify: AlertifyService) { }
  ngOnInit(){ 
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alerify.success('Logged in succesfully!');
    }, error => {
      this.alerify.error(error);
    });

  }

loggedIn() {
  return this.authService.loggedIn();
}

Logout() {
  localStorage.removeItem('token');
  this.alerify.success('logged out');
}
}
