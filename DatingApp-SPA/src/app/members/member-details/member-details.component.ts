import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/User';
import {  NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userservice: UserService , private alertify : AlertifyService , private route: ActivatedRoute) { }

  ngOnInit() {
   //this. loadUser();
   //resolver to get the data before activate the route itself, if we don't use resolver , user object will be null after route activate till haveing the data .
   
   this.route.data.subscribe(data => {
     this.user =  data['user'];
   });

   this.galleryOptions = [
   {
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
   }
  ];
    this.galleryImages = this.getImages();
  }
getImages() {
  const ImagesUrls = [];

  for (let i = 0; i < this.user.photos.length ; i++){
    ImagesUrls.push({
      small: this.user.photos[i].url,
      medium: this.user.photos[i].url,
      big: this.user.photos[i].url,
      description: this.user.photos[i].descriPtion

    });
  }
  return ImagesUrls;
}
  // loadUser() { 
  //   this.userservice.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
  //     this.user = user;
  //   },
  //   error => {
  //     this.alertify.error(error);
  //   });
  // }
}
