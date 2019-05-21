import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_Services/Auth.service';

@Injectable()

export class MemberEditResolver implements Resolve<User>{

    constructor(private userservice: UserService , private alertify: AlertifyService,
         private authservice:AuthService,private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        return this.userservice.getUser(this.authservice.dcodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error('problem retreiving data');
                this.router.navigate(['/members']);
                return of(null);
            })
        )
    }
}