import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
//import { ContactsService } from './contacts.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(public alertCtrl: AlertController, public toastController: ToastController,
    //public contactservice: ContactsService
    ) { }

  async toastMessage(message,css) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
      cssClass: css,
    });
    toast.present();
  }
  async confirm(uid){
  const alert = await this.alertCtrl.create({
    header: 'Delete User',
    cssClass: 'adminAlert',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'alertcancel',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Okay',
        cssClass: 'alertokay',
        handler: () => {
          console.log('Confirm Okay');
          //this.contactservice.deleteContact(uid)
          this.toastMessage('Contact Deleted','toast')
          //pc.amount = 0; 
        }
      }
    ]
  });
  }
}
