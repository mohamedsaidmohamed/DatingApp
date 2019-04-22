import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() ValuesFromHome:  any;
  @Output() CancelRegister = new EventEmitter();
  model: any = {};

  constructor(private authService:AuthService, private alerify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe(() => {
      this.alerify.success('registration successful');
    }, error => {
      this.alerify.error(error);
    });
  }
  cancel() {
    this.CancelRegister.emit(false);
  }
}
