import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
//import firebase from 'firebase';
import { Observable } from 'rxjs';

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
//itemCollection: AngularFirestoreCollection<Contacts>;
//private itemsCollection: AngularFirestoreCollection<any>;
constructor(public afireauth: AngularFireAuth, public afs: AngularFirestore,) {
}
addContact(newcontact) {
  console.log('newcontact', newcontact)
  this.contactRef.add({
    displayName: newcontact.displayName,
    phone: newcontact.phone,
    photoURL: newcontact.photoURL
  })
  .then( docRef => {
    this.afs.collection('messages').doc(docRef.id).set({
      id: docRef.id,
    })
    this.afs.collection('contacts').doc(docRef.id).update({
      uid: docRef.id,
    })
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
}
export interface Contacts {
  displayName: string;
  phone: string;
  photoURL: string;
  id?: string;
}