import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from 'src/app/_Services/Auth.service';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { Message } from 'src/app/_models/Message';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
@Input() recipientId:number;
messages: Message[];
newMessage:any={} ;

  constructor(private authservice:AuthService,private userService:UserService,private alertifyService:AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }
  loadMessages() {
    const currentUserId=this.authservice.dcodedToken.nameid;
    this.userService.getMessageThread(this.authservice.dcodedToken.nameid,this.recipientId)
    .pipe(
      tap(messages => {
          for(let i = 0; i< messages.length ; i++)
          {
            if(messages[i].isread === false && messages[i].recipientId === currentUserId)
            {
                 this.userService.MarkMessageAsRead(messages[i].id, currentUserId);
            }
          }
      })
    )
    .subscribe(messages => {
      this.messages = messages;
    }, error => {
      this.alertifyService.error(error);
    });
  }

  SendMessage() {
    this.newMessage.recipientId=this.recipientId;
    this.userService.SendMessage(this.authservice.dcodedToken.nameid,this.newMessage)
    .subscribe((message:Message) => {
      this.messages.unshift(message);
      this.newMessage.content = '';
    }, error => {
      this.alertifyService.error(error);
    });
  }

}
