import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ContactsService } from '../contacts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.page.html',
  styleUrls: ['./contact-add.page.scss'],
})
export class ContactAddPage implements OnInit {
  newcontact = {
    phone: '',
    displayName: '',
    photoURL: 'https://firebasestorage.googleapis.com/v0/b/ionic3chat-1cac4.appspot.com/o/no-avatar.png?alt=media&token=549cd7b9-e4fe-471c-873b-5bb57d4ac406',
  }
  constructor(public contactservice: ContactsService,
    public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController,
    public route: Router) {
  }
  ngOnInit() {
  }

  async signupContact() {
    const toaster = await this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });
    if (this.newcontact.phone == '' || this.newcontact.displayName == '') {
      toaster.message['All fields are required'];
      toaster.present();
    }
    else {
      let loader = await this.loadingCtrl.create({
        message: 'Please wait'
      });
      loader.present();
      this.contactservice.addContact(this.newcontact)
      //.then((res: any) => {
        loader.dismiss();
      //  if (res.success)
        this.route.navigateByUrl('/tabs/(contacts:contacts)');
      //  else
      //    alert('Error' + res);
     // })
    }  
  }
  goback() {
    this.route.navigateByUrl('/tabs/(contacts:contacts)');
  }

}
