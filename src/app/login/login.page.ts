import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
//import * as firebase from 'firebase/app';
import { admincreds } from '../admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = {} as admincreds;
  activeUser; 
  constructor(public authService: AuthService, public route:Router
    ) {
  }
  ngOnInit() {
    this.authService.user.subscribe(user => {
      if (user){
      this.activeUser = user.uid;
      console.log('user is logged in still',this.activeUser);
      this.route.navigateByUrl('/tabs/(messages:messages)');
      }
      else {
        this.activeUser = null;
        console.log('user is logged out',this.activeUser);
      }
    })
  }
  login() {
    console.log(this.credentials)
    this.authService.login(this.credentials).then((res: any) => {
      if (!res.code)
        this.route.navigateByUrl('/tabs/(messages:messages)');
      else
        alert('username/password not correct');
    })
    //this.authService.login2(this.credentials);
    //this.email = this.password = '';    
  }
}
