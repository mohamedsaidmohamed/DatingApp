import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Nav',
  templateUrl: './Nav.component.html',
  styleUrls: ['./Nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public authService: AuthService, private alerify: AlertifyService,private router:Router) { }
  ngOnInit(){ 
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alerify.success('Logged in succesfully!');
    }, error => {
      this.alerify.error(error);
    },()=>{
      this.router.navigate(['/members']);
    });

  }

loggedIn() {
  return this.authService.loggedIn();
}

Logout() {
  localStorage.removeItem('token');
  this.alerify.success('logged out');
  this.router.navigate(['/home']);
}
}
