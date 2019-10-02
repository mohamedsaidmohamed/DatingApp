import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Pagination, PaginationResult } from '../_models/Pagination';
import { AuthService } from '../_Services/Auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'unread';

  constructor(private route: ActivatedRoute,private userService: UserService,private authService: AuthService,private alertService:AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages(){
    this.userService.getMessages(this.authService.dcodedToken.nameid ,
      this.pagination.currentPage , this.pagination.itemPerPage , this.messageContainer)
    .subscribe((res: PaginationResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;
    }, error => {
        this.alertService.error(error);
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
  DeleteMessage(id: number): void {
    this.alertService.confirm('Are you sure to delete this message?', () => {
      this.userService.DeleteMessage(id,this.authService.dcodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(x => x.id === id), 1 );
        this.alertService.success('message deleted succefully');
      } , error => {
        this.alertService.error(error);
      });

    });
  
  }
}
