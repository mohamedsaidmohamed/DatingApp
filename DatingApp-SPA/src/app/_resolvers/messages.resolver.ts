import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/Message';
import { AuthService } from '../_Services/Auth.service';

@Injectable()

export class MessagesResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer='unread';
    constructor(private userservice: UserService , private alertify: AlertifyService, private router: Router,private authService:AuthService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userservice.getMessages(this.authService.dcodedToken.nameid,
            this.pageNumber,this.pageSize,this.messageContainer).pipe(
            catchError(error => {
                this.alertify.error('problem retreiving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        )
    }
}