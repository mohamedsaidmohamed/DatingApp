import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/_Services/Auth.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange= new EventEmitter<string>();

  uploader: FileUploader ;
  hasBaseDropZoneOver = false;
  baseurl = environment.apiUrl;
  currentphoto:Photo;
  constructor(private authservice:AuthService,private userservice: UserService,private alertify:AlertifyService) { }

  ngOnInit() {
  this.initializeUploader();
  }
 
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
        url: this.baseurl + 'users/' + this.authservice.dcodedToken.nameid + '/photos',
        authToken: 'Bearer ' + localStorage.getItem('token'),
        isHTML5: true,
        allowedFileType: ['image'],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false ; };
    this.uploader.onSuccessItem = (item, response, status, headers) =>{
      const res: Photo = JSON.parse(response);
      const photo = {
        id: res.id,
        url: res.url,
        isMain: res.isMain,
        dateAdded: res.dateAdded,
        descriPtion: res.descriPtion
      };

      this.photos.push(photo);
      if(photo.isMain){
        this.authservice.changeMemberPhoto(photo.url);
        this.authservice.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authservice.currentUser));
      }
    };
  }
  SetMainPhoto(photo: Photo) {
      this.userservice.setMainPhoto(this.authservice.dcodedToken.nameid,photo.id).subscribe(()=>{
           // this.alertify.success('Main photo has successfully setted');
            this.currentphoto = this.photos.filter(x => x.isMain === true)[0];
            this.currentphoto.isMain = false;
            photo.isMain = true;
            //this.getMemberPhotoChange.emit(photo.url);
            this.authservice.changeMemberPhoto(photo.url);
            this.authservice.currentUser.photoUrl = photo.url;
            localStorage.setItem('user', JSON.stringify(this.authservice.currentUser));

      }, error => {
            this.alertify.error(error);
      });
  }
  DeletePhoto(photo: Photo) {
    this.alertify.confirm('Are you sure you want to delete this photo!',()=>{
      this.userservice.deletePhoto(this.authservice.dcodedToken.nameid,photo.id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(x=>x.id === photo.id),1);
        this.alertify.success('Deleted successfully!');
      }, error => {
        this.alertify.error('Failed to delete selected photo');
      });
    });
  }

}
