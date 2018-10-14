import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ContactsService, Contacts } from '../contacts.service';
//import firebase from 'firebase';
//import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
//import { Action } from 'rxjs/internal/scheduler/Action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  temparr = [];
  filteredcontacts = [];
  //public users: Array<any> = [];
  //public usersKey: Array<any> = [];
  //public uid: string;
  public filtered: Observable<any[]>;
  public contacts: Observable<Contacts[]>;
  private contactCollection: AngularFirestoreCollection<Contacts>;
  //items: Observable<Contacts[]>;

  constructor(
    public contactservice: ContactsService, public alertCtrl: AlertController,
    public route: Router) {   
      this.contactCollection = this.contactservice.afs.collection<Contacts>('contacts');
  
      this.contacts = this.contactCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Contacts;
        const id = a.payload.doc.id;
        return { id, ...data };
      })))
      this.loadAllContacts();   

 }

  ngOnInit() {
  }
  resetChanges(){
    this.filteredcontacts = this.temparr;
  }
  searchuser(searchbar) {
    this.filteredcontacts = this.temparr;
    console.log('filtered',this.filteredcontacts);
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return; 
    }
    this.filteredcontacts= this.filteredcontacts.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }
  addContact() {
    this.route.navigateByUrl('tabs/(contacts:contact-add)');
  }
  viewContact(contact) {
    console.log('here we go',contact);
    this.route.navigateByUrl(`tabs/(contacts:contact-details/${contact})`);
  }
  messageContact(contact) {
    console.log('prenav',contact);
    this.route.navigateByUrl(`tabs/(messages:message-details/${contact.id}/${contact.displayName})`);
   }
  deleteContact(uid) {
    console.log('uid',uid);
    this.contactservice.deleteContact(uid).then(() => {
       alert('Contact Deleted');
    }).catch((err) => {
      alert(err);
    })
  }

  loadAllContacts() {
    this.temparr = [];
    this.filteredcontacts = [];
    this.contacts.subscribe( opportunities => {
        //this.opportunity = opportunities[index];
        console.log('op',opportunities);
        this.filteredcontacts = opportunities;
        this.temparr = opportunities;
     });
 }
  documentToDomainObject = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
}
}