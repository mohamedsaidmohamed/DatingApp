import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/Auth/';
  JWTHelper = new  JwtHelperService();
  dcodedToken: any;

constructor(private http: HttpClient) { }

 login(model: any) {
  return this.http.post(this.baseUrl + 'login' , model)
  .pipe(
    map((response: any) => {
    const user = response;
    if (user) {
      localStorage.setItem('token', user.token);
      this.dcodedToken = this.getDecodedToken();
    }
  })
)
}

register(model: any) {
  return this.http.post(this.baseUrl + 'register', model);
}

loggedIn() {
  const token = localStorage.getItem('token');
  return !this.JWTHelper.isTokenExpired(token);
}

getDecodedToken() {
  const token = localStorage.getItem('token');
 if( token ) {
    return this.JWTHelper.decodeToken(token);
  }
}

}
