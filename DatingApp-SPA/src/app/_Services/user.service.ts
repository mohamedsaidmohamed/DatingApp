import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//we will not send token in header hard coded , we use JWT Module : library that provides an HttpInterceptor which automatically attaches a JSON Web Token to HttpClient requests.
// const HttpOptions = {
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };

@Injectable({
  providedIn: 'root'
})

export class UserService {
  baseUrl = environment.apiUrl ;

constructor(private http: HttpClient) { }

getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.baseUrl + 'users' /*, HttpOptions*/);
}
getUser(id): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id /*, HttpOptions*/);
}

}