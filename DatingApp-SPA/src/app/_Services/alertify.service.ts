import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

confirm(messgae: string, onCallback: () => any) {
  alertify.confirm(messgae, function(e) {
    if(e) {
      onCallback();
    } else {}
  });

}

success(message: string) {
  alertify.success(message);
}
warning(message: string) {
  alertify.warning(message);
}
error(message:string) {
  alertify.error(message);
}
message(message:string) {
  alertify.message(message);
}


}
