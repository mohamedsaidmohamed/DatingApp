import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class MemberListResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;

    constructor(private userservice: UserService , private alertify: AlertifyService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userservice.getUsers(this.pageNumber,this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('problem retreiving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        )
    }
}