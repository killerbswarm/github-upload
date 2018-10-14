import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { AdminService} from '../admin.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  newadmin = {
    email: '',
    password: '',
    displayName: '',
    secret: '',
  }
  secret = '4SwarmOwners!';
  constructor(public adminservice:AdminService,public route:Router,public authService: AuthService, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  }
  ngOnInit() {
  }
  async signup() {
    var toaster = await this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });
    if (this.newadmin.email == '' || this.newadmin.password == '' || this.newadmin.displayName == '') {
      toaster.message = 'All fields are required dude';
      toaster.present();
    }
    else if (this.newadmin.password.length < 7) {
      toaster.message = 'Password is not strong. Try giving more than six characters';
      toaster.present();
    } 
    else if (this.newadmin.secret != this.secret ){
      toaster.message = 'You dont know the secret code :p ';
      toaster.present();  
    }    
    else {
      let loader = await this.loadingCtrl.create({
        message: 'Please wait',
      });
      await loader.present();
      this.adminservice.addadmin(this.newadmin).then((res: any) => {
        loader.dismiss();
        if (res.success)
          this.route.navigateByUrl('');
        else
          alert('Error' + res);
      }) 
    }
  }  

  goback() { 
    this.route.navigateByUrl('/login');
    }
}
