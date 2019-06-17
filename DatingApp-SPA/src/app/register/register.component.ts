import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { formControlBinding } from '@angular/forms/src/directives/ng_model';
import { validateConfig } from '@angular/router/src/config';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() ValuesFromHome:  any;
  @Output() CancelRegister = new EventEmitter();
  user: User;
  RegisterForm: FormGroup;
  bsConfig : Partial<BsDatepickerConfig>;
  constructor(private authService:AuthService, private alerify: AlertifyService , private router:Router,private fb: FormBuilder) { }

  ngOnInit() {
    // this.RegisterForm =new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.confirmPasswordValidator);
    this.bsConfig = {
      containerClass: 'theme-red'
    },
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.RegisterForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required],
      dateOfBirth:[null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    }, {validator: this.confirmPasswordValidator});
  }

  confirmPasswordValidator(g: FormControl) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }
  register() {
    // this.authService.register(this.model).subscribe(() => {
    //   this.alerify.success('registration successful');
    // }, error => {
    //   this.alerify.error(error);
    // });
    if(this.RegisterForm.valid){
      this.user = Object.assign({},this.RegisterForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alerify.success('registration successful');
      }, error => {
        this.alerify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }

  }
  cancel() {
    this.CancelRegister.emit(false);
  }
}
