import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_Services/user.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
users: User[];
currentUser = JSON.parse(localStorage.getItem('user'));
genderList = [{value: 'male', display: 'Males'} , {value: 'female', display: 'Females'}];
userParams: any ={};
pagination: Pagination;
  constructor(private userSerivce: UserService,private alertify:AlertifyService,private route:ActivatedRoute) { }

  ngOnInit() {
   // this.loadUsers();
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.resetFilter();
  }
  resetFilter() {
    this.userParams.minAge  = 18;
    this.userParams.maxAge  = 99;
    this.userParams.gender  = this.currentUser.gender === 'female' ? 'male' : 'female';
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userSerivce
        .getUsers(this.pagination.currentPage , this.pagination.itemPerPage , this.userParams)
        .subscribe((users: PaginationResult<User[]>) => {
          this.users = users.result;
          this.pagination = users.pagination;
    },
    error => {
      this.alertify.error(error);
    });
  }


}
