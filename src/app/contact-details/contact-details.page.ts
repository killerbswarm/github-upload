import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ImghandlerService } from '../imghandler.service';
import { ContactsService, Contacts } from '../contacts.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.page.html',
  styleUrls: ['./contact-details.page.scss'],
})
export class ContactDetailsPage implements OnInit {
  avatar: string;
  displayName: string;
  phone: string;
  
  public id = this.route.snapshot.paramMap.get('contact');
  public contactDetails: Observable<Contacts>;
  constructor(
    public route: ActivatedRoute,
    public contactservice: ContactsService, public zone: NgZone, public alertCtrl: AlertController,
    public imghandler: ImghandlerService) {
   }
  ngOnInit() {
    this.loadContactDetails(this.id);
  }

  loadContactDetails(contact) {
    this.contactDetails = this.contactservice.getContactDetails(contact).valueChanges();
    this.contactDetails.subscribe(data=>{
      this.displayName = data.displayName;
      this.phone = data.phone;
      this.zone.run(() => {
        this.avatar = data.photoURL;
      })
  })
  }
  async editname() {
    let statusalert = await this.alertCtrl.create({
      buttons: ['okay']
    });
    let alert = await this.alertCtrl.create({
      header: 'Edit Display Name',
      inputs: [{
        name: 'displayName',
        placeholder: 'Display Name'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
      {
        text: 'Edit',
        handler: data => {
          if (data.displayName) {
            console.log("push to data",this.id)
            data.id = this.id; 
            console.log("edit name data",data.id);
            this.contactservice.updateContactName(data).then((res: any) => {
              if (res.success) {
                //statusalert.header['Updated'];
                //statusalert.subHeader['Your Name has been changed successfully!!'];
                statusalert.present();
                //this.zone.run(() => {
                //  this.displayName = data.displayName;
                //})
              }

              else {
                //statusalert.header['Failed'];
                //statusalert.subHeader['Your Name was not changed'];
                statusalert.present();
              }
                             
            })
          }
        }
        
      }]
    });
    alert.present();
  }
  async editphone() {
    let statusalert = await this.alertCtrl.create({
      buttons: ['okay']
    });
    let alert = await this.alertCtrl.create({
      header: 'Edit Phone',
      inputs: [{
        name: 'phone',
        placeholder: 'Phone'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
      {
        text: 'Edit',
        handler: data => {
          if (data.phone) {
            data.id = this.id; 
            this.contactservice.updateContactPhone(data).then((res: any) => {
              if (res.success) {
                //statusalert.header['Updated'];
                //statusalert.subHeader['Your Phone has been changed successfully!!'];
                statusalert.present();
                //this.zone.run(() => {
                  //this.displayName = data.nickname;
                //})
              }

              else {
                //statusalert.header['Failed'];
                //statusalert.subHeader['Your Phone was not changed'];
                statusalert.present();
              }
                             
            })
          }
        }
        
      }]
    });
    alert.present();
  }
}
