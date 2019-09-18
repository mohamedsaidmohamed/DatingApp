import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';
import { Pagination, PaginationResult } from '../_models/Pagination';
import { AlertifyService } from '../_Services/alertify.service';
import { UserService } from '../_Services/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})

export class ListsComponent implements OnInit {
  
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(private authService:AuthService,private userService:UserService,private route:ActivatedRoute,private alertifyService:AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userService
        .getUsers(this.pagination.currentPage , this.pagination.itemPerPage , null,this.likesParam)
        .subscribe((users: PaginationResult<User[]>) => {
          this.users = users.result;
          this.pagination = users.pagination;
    },
    error => {
      this.alertifyService.error(error);
    });
  }

}
