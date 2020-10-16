import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
//import firebase from 'firebase';
import { Observable } from 'rxjs';
import { AlertsService } from '../app/alerts.service'
import { AlertController, ToastController } from '@ionic/angular';
//import { firestore } from 'firebase';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { collectionData, docData } from 'rxfire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ContactsService { 
contactRef = this.afs.collection('contacts');  
public users: Array<any> = [];
public usersKey: string;
public uid: string; 
public cid: string;
public usersList = [];
items: Observable<Contacts[]>;
public db = firebase.firestore()
public cdb = firebase.firestore().collection('contacts');
public contactCollect;
public allContacts;
public contact;
public fullContacts;
//itemCollection: AngularFirestoreCollection<Contacts>;
//private itemsCollection: AngularFirestoreCollection<any>;
constructor(public afireauth: AngularFireAuth, public alertservice: AlertsService, public afs: AngularFirestore,
  public alertCtrl: AlertController, public toastController: ToastController) {
}
firequery(start, end) {
  return this.afs.collection('contacts', ref => ref.orderBy('displayName').startAt(start).endAt(end)).valueChanges();
}
getallContacts() {
  return this.afs.collection('contacts', ref => ref.orderBy('displayName')).valueChanges();
}
getFullList() {
  this.contactCollect = this.db.collection('contacts').orderBy('timestamp', 'desc')
  this.fullContacts = collectionData(this.contactCollect, 'id')
    .pipe(map(contact => contact ))
}
addContact(newcontact) {
  console.log('newcontact', newcontact)
  this.contactRef.add({
    displayName: newcontact.displayName,
    phone: newcontact.phone,
    photoURL: newcontact.photoURL,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  }) 
  .then( docRef => {
    this.afs.collection('messages').doc(docRef.id).set({
      id: docRef.id,
    })
    this.afs.collection('contacts').doc(docRef.id).update({
      uid: docRef.id,
    })
    this.alertservice.toastMessage(newcontact.displayName+' Added', 'toast');
  }) 
}
updateimage(imageurl) {
}
getContactDetails(contact): 
      AngularFirestoreDocument<Contacts> {
        return this.contactRef.doc(contact);
}
updateContactName(contact) {
  var promise = new Promise((resolve, reject) => {
    this.contactRef.doc(contact.id).update({
      displayName: contact.displayName})
      .then(() => {
       resolve({ success: true });
      }).catch((err) => {
          reject(err);
      })
    })
  return promise;
}
updateContactPhone(contact) {
  var promise = new Promise((resolve, reject) => {
     this.contactRef.doc(contact.id).update({
      phone: contact.phone})
    .then(() => {
          resolve({ success: true });
      }).catch((err) => {
          reject(err);
      })
    })
  return promise;
}
deleteContact(uid) {
  var promise = new Promise((resolve, reject) => {
      this.afs.collection('messages').doc(uid).delete()
      this.afs.collection('messages').doc(uid).delete()
      this.contactRef.doc(uid).delete().then(() => {
        resolve(true);
      })
      .then(() => { 
      }).catch((err) => {
      reject(err);
    })
  })
  return promise; 
}
/*
getAllContacts():
  AngularFirestoreCollection<Contacts> {
    return this.afs.collection('contacts'); 
}
getContacts() { 
  return this.afs.collection<Contacts>('contacts');
}
getContactInfo(contact) {
  return this.afs.doc(contact)
}
*/
async contactToast(message) {
  const toast = await this.toastController.create({
    message: message,
    duration: 5000,
    position: 'top',
    cssClass: 'toast',
  });
  toast.present();
}
async confirm(){
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
        this.contactToast('Contact Deleted')
        //pc.amount = 0; 
      }
    }
  ]
});
}
}
export interface Contacts {
  displayName: string;
  phone: string;
  photoURL: string;
  id?: string;
}