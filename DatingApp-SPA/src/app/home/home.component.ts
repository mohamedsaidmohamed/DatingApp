import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode: any;
  values: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.GetValues();
  }

  registerToggle () {
    this.registerMode = true;
  }

  CancelRegisterModel(registerMode:boolean) {
    this.registerMode = registerMode;
  }

  GetValues() {
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.values = response;
    }, error => {
      console.log(error);
    });
  }

}
