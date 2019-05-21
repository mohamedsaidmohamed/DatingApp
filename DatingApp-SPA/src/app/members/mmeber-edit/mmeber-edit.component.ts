import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_Services/user.service';
import { AuthService } from 'src/app/_Services/Auth.service';

@Component({
  selector: 'app-mmeber-edit',
  templateUrl: './mmeber-edit.component.html',
  styleUrls: ['./mmeber-edit.component.css']
})
export class MmeberEditComponent implements OnInit {
  @ViewChild('editform') editform : NgForm;
  user: User;
  @HostListener('window:beforeunload',['$event'])
  unloadnotification($event:any){
    if(this.editform.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private alertify: AlertifyService,
    private userservice: UserService, private authservice: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data=>{
        this.user = data['user'];
    });
  }
  UpdateUser() {
    this.userservice.updateUser(this.authservice.dcodedToken.nameid , this.user).subscribe(next => {
      this.alertify.success('Profile Updated Successfully!');
      this.editform.reset(this.user);
    }, error => {
      this.alertify.error(error);
    });
  }

}
