import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { PaginationResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/Message';

//we will not send token in header hard coded , we use JWT Module : library that provides an HttpInterceptor which automatically attaches a JSON Web Token to HttpClient requests.
// const HttpOptions = {
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };

@Injectable({
  providedIn: 'root'
})

export class UserService {
  baseUrl = environment.apiUrl ;

constructor(private http: HttpClient) { }

getUsers(page? , itemsPerPage?,userParams?,likesParam?): Observable<PaginationResult<User[]>> 
{
  const paginationResult : PaginationResult<User[]> =new PaginationResult<User[]>();
  let params = new HttpParams();
  if(page != null && itemsPerPage != null){
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }

  if(userParams != null) {
    params = params.append('MinAge', userParams.minAge);
    params = params.append('MaxAge', userParams.maxAge);
    params = params.append('Gender', userParams.gender);
    params = params.append('OrderBy', userParams.orderBy);
  }

  if(likesParam === 'Likers') {
    params = params.append('likers', 'true');
  }

  if(likesParam === 'Likees') {
    params = params.append('likes', 'true');
  }

  return this.http.get<User[]>(this.baseUrl + 'users' , {observe: 'response', params})
  .pipe(
      map( response => {
        paginationResult.result = response.body;
        if ( response.headers.get('Pagaination') != null){
          paginationResult.pagination = JSON.parse(response.headers.get('Pagaination'));
        }
       return  paginationResult;
      })
  );
}
getUser(id): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id /*, HttpOptions*/);
}
updateUser(id: number , user: User) {
return this.http.put(this.baseUrl + 'users/' + id, user);
}
setMainPhoto(userId: number , photoId: number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setMain', {});
}
deletePhoto(userId:number,photoId:number){
  return this.http.delete(this.baseUrl+'users/'+userId+'/photos/'+photoId);
}

SendLike(userId: number, recipientId: number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/like/' + recipientId,{});
}

getMessages(id: number, page?, itemsPerPage?, messageContainer?){
  const PagainatedResult: PaginationResult<Message[]> = new PaginationResult<Message[]>();
  let params = new HttpParams();

  params=params.append('MessageContainer' , messageContainer);

  if(page != null && itemsPerPage != null){
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }

  return this.http.get<Message[]>(this.baseUrl+'users/' + id + '/messages',{observe:'response',params})
  .pipe(
    map(response => {
      PagainatedResult.result = response.body;
      if(response.headers.get('Pagaination') != null) {
        PagainatedResult.pagination = JSON.parse(response.headers.get('Pagaination'));
      }

      return PagainatedResult;
    })
  );
}
getMessageThread(userId:number,recipientId:number ) {
  return this.http.get<Message[]>(this.baseUrl+'users/'+ userId +'/messages/thread/'+recipientId);
}

SendMessage(userId:number,message:Message) {
  return this.http.post(this.baseUrl+'users/'+userId+'/messages/',message);
}

DeleteMessage(messageId:number,userId:number) {
  return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId,{});
}
MarkMessageAsRead(messageId:number, userId: number){
  return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read' ,{})
  .subscribe();
}
}