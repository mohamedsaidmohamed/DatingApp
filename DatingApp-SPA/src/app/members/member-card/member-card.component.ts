import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { AuthService } from 'src/app/_Services/Auth.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})

export class MemberCardComponent implements OnInit {
@Input() user: User;

  constructor(private authService: AuthService ,private alertifyService:AlertifyService,private userService:UserService) { }

  ngOnInit() {
  }

  SendLike(id: number) {
      this.userService.SendLike(this.authService.dcodedToken.nameid,id).subscribe(data=> {
        this.alertifyService.success('You have liked: ' + this.user.knownAs);
      },error => {
        this.alertifyService.error(error);
      });
      }
}
