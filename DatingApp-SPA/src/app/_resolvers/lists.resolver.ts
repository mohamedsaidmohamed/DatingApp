import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

//Resolve guard is used in the scenario where before navigating 
//to any route we want to ensure whether there is data available or not. 
//If there is no data then it has no meaning to navigate there. 
//It means we have to resolve data before navigating to that route.
//https://www.concretepage.com/angular-2/angular-resolve-guard-example

export class ListsResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;
    likesParam  ='Likers';
    constructor(private userservice: UserService , private alertify: AlertifyService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userservice.getUsers(this.pageNumber , this.pageSize, null , this.likesParam).pipe(
            catchError(error => {
                this.alertify.error('problem retreiving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        )
    }
}