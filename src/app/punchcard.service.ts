import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { ToastController, AlertController } from '@ionic/angular';
//import { collectionData, docData } from 'rxfire/firestore';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { ContactsService, Contacts } from '../app/contacts.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http'




@Injectable({
  providedIn: 'root'
})
export class PunchcardService {
  public punchCollection;
  public contactCollection;
  public contactUser: Observable<any[]>
  public punchCard: Observable<any[]>;
  public pc = [];
  public db = firebase.firestore()
  public pcdb = firebase.firestore().collection('punchcards');
  private pin = '401';
  public newAmount: number;
  public punch;
  temparr = [];
  filteredcontacts = [];

  public zapUrlRefill = 'https://hooks.zapier.com/hooks/catch/2598053/lphqeh/';
  public zapUrlUse = 'https://hooks.zapier.com/hooks/catch/2598053/e6n02f/';
  public zapUrlEdit = 'https://hooks.zapier.com/hooks/catch/2598053/e6733a/';
  public zapUrlAdd = 'https://hooks.zapier.com/hooks/catch/2598053/e6j6bh/';


  constructor(public afs: AngularFirestore,
    public alertCtrl: AlertController,
    public contactservice: ContactsService,
    public httpClient: HttpClient,
    public toastController: ToastController) { }

    getPunchCards() {
      return this.punchCollection = this.afs.collection('punchcards', ref => ref.orderBy('timestamp','desc').where('active','==',true))
      .snapshotChanges()
      .pipe(
        switchMap(contact => { //getting contact name
          return combineLatest(...contact
            .map(
              c => {
                let cid = c.payload.doc.id;
                let data = c.payload.doc.data();
                //console.log(data['uid'])
                data['id'] = cid;
                const ref = this.afs.collection('contacts',ref => ref.where('uid','==',data['uid']).limit(1))
                return ref.valueChanges().pipe(map(contact =>
                 ({contact: contact['0'], ...data})
                  ));
              }));
        }))
      }

  async punchToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
      cssClass: 'toast',
    });
    toast.present();
  }
  usePunches(pc) {
    //console.log(pc);
    this.newAmount = pc.amount - 1;
    Number(this.newAmount)
    if (pc.amount > 1) {
      this.pcdb.doc(pc.id).update({
        amount: this.newAmount
      })
        .then(() => {
          this.punchToast(`Punch Used - ${this.newAmount} Punches Remaining`);
          pc['newamount'] = this.newAmount;
          console.log('Punch Redeemed');
          this.sendSlackMessage(pc,this.zapUrlUse)
        }).catch((err) => {
          this.punchToast("Punch Failed");
          console.error(err);
        })
    } else {
      this.pcdb.doc(pc.id).update({
        active: false,
        amount: this.newAmount,
      })
        .then(() => {
          this.punchToast("Punch Ran Out");
          console.log('out of punches')
          pc.amount = 0;
          pc['newamount'] = this.newAmount;
          this.sendSlackMessage(pc,this.zapUrlUse)
          this.presentAlertConfirm(pc)
        }).catch((err) => {
          this.punchToast("Punch Failed");
          console.error(err);
        })
    }
  }

  async editPunches(pc) {
    const alert = await this.alertCtrl.create({
      header: 'Admin Panel',
      subHeader: 'Edit Number of Punches',
      message: 'Enter 0 to Remove User From List',
      cssClass: 'adminAlert',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Enter Available Punches'
        },
        {
          name: 'pin',
          type: 'password',
          id: 'pin-id',
          placeholder: 'PIN'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          cssClass: 'secondary',
          handler: (data) => {
            this.newAmount = Number(data.amount);
            if (data.amount == 0 && data.pin == this.pin) { //Set to Zero - Clear PunchCard
              this.pcdb.doc(pc.id).update({
                amount: this.newAmount,
                active: false,
              })
                .then(() => {
                  this.punchToast(`Card Reset to - ${this.newAmount} Available Punches`);
                  pc['newamount'] = this.newAmount;
                  this.sendSlackMessage(pc,this.zapUrlEdit);
                  console.log('Punch Card Cancelled - Set to Zero');
                }).catch((err) => {
                  this.punchToast("PunchCard Reset Failed");
                  console.error(err);
                })
            } else if (data.amount != 0 && data.pin == this.pin) { //Amount Not 0 and Valid PIN

              this.pcdb.doc(pc.id).update({
                amount: this.newAmount,
              })
                .then(() => {
                  this.punchToast(`Card Reset to - ${this.newAmount} Available Punches`);
                  console.log('Punch Edited');
                  pc['newamount'] = this.newAmount;
                  this.sendSlackMessage(pc,this.zapUrlEdit);
                }).catch((err) => {
                  this.punchToast("PunchCard Reset Failed");
                  console.error(err);
                })
            }
            else if (data.pin != this.pin) { //PIN incorrect
              this.punchToast("PIN Incorrect");
              return false
            } else {  //no entry
              this.punchToast("denied");
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  refillPunches(pc) {
    this.presentAlertConfirm(pc)
  }
  addPunches(pc) { //update to 10 punches available - activate
    console.log("pcamount", pc.amount)
    this.newAmount = Number(pc.amount) + 10;
    this.pcdb.doc(pc.id).update({
      amount: this.newAmount,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      active: true, 
    })
    this.pcdb.doc(pc.id).collection('orders').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        this.punchToast(`PunchCard Refilled - ${this.newAmount} Available Punches`);
        //this.sendNoticeForPayment(pc);
        this.sendSlackMessage(pc,this.zapUrlRefill);
        console.log('Punch Refilled');
      }).catch((err) => {
        this.punchToast("Punch Failed");
        console.error(err);
      })
  }

  async addPunchToNew(contact) { //create Punchcard to new person
    console.log(contact.uid)
    const alert = await this.alertCtrl.create({
      header: 'Admin Panel',
      subHeader: contact.displayName,
      message: "<br> Add New PunchCard",
      cssClass: 'addNewAlert',
      inputs: [
        {
          name: 'pin',
          type: 'password',
          placeholder: 'Admin PIN',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          cssClass: 'secondary',
          handler: (data) => {
            if (data.pin == this.pin) {  // must have admin pin
              if (contact) { //get the user that was just entered  
                this.db.collection('punchcards').where('uid', "==", contact.uid).get()
                  .then((snapShot) => {
                    if (snapShot.empty) { //user doesn't exist in punchcards Collection
                      console.log('user never had pc')
                      this.db.collection("punchcards").add({
                        amount: 10,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        active: true,
                        uid: contact.uid,
                      })
                      this.punchToast(`PunchCard Added: 10 Available Punches`);
                      console.log('PunchCard added to New user');
                    this.sendSlackMessage(contact,this.zapUrlAdd);
                    } else {
                      snapShot.forEach((data => { //User exists in punchcards Collection
                        if (data.data().active == false) { //User ran out
                          this.db.collection("punchcards").doc(data.id).update({
                            amount: 10,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            active: true,
                          })
                          this.punchToast(`PunchCard Refilled: 10 Available Punches`);
                         this.sendSlackMessage(contact,this.zapUrlAdd);
                          console.log('PunchCard added to existing user');
                        } else { //user has a punchcard do not duplicate
                          this.punchToast(`User already has a punchcard - just refill it`);
                          console.log('PunchCard exists');
                        }
                      }))
                    }
                    //this.sendNoticeForPayment(contact);

                  })
                  .catch((err) => {
                    console.log('here')
                    console.error(err);
                  })
              } else {  //Name not entered
                this.punchToast("Enter User's Name");
                return false;
              }
            } else { //pin incorrect
              this.punchToast("PIN Incorrect");
              return false;
            }
          }
        }
      ]
    });
    await alert.present()
  }
  async presentAlertConfirm(pc) {
    const alert = await this.alertCtrl.create({
      header: 'Refill PunchCard',
      message: '<br> <b>Product:</b> Punchcard 10 Uses <br> <br> <b>Amount:</b> $25 <br><br> <b>Notice:</b> A charge will be added to your invoice if you select Okay <br> <br> ',
      cssClass: 'refillAlert',
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
            //pc.amount = 0; 
            this.addPunches(pc)
          }
        }
      ]
    });

    await alert.present();
  }
  sendSlackMessage(data,url) {
    //console.log('npf', data) // pc include all punch and contact info
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    this.httpClient.post(url, data, { headers: headers, responseType: 'text' }).subscribe(
      res => {
        console.log(res);
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
      }
    );
  }
  
  firequery(start, end) {
    return this.afs.collection('contacts', ref => ref.limit(5).orderBy('displayName').startAt(start).endAt(end)).valueChanges();
  }

  getallContacts() {
    return this.afs.collection('contacts', ref => ref.orderBy('displayName')).valueChanges();
  }
}

export interface PunchCard {
  uid: string;
  active: boolean;
  amount: number;
  timestamp?: string;
  id?: string;
}