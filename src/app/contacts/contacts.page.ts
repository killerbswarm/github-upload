import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ContactsService, Contacts } from '../contacts.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { List } from '@ionic/angular';
import { AlertsService } from '../alerts.service';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  @ViewChild('slidingList') slidingList: List
  temparr = [];
  filteredcontacts = [];
  private contact;
   //search var
   searchterm: string;
   startAt = new Subject();
   endAt = new Subject();
   contacts;
   allContacts;
   startobs = this.startAt.asObservable();
   endobs = this.endAt.asObservable();
   filter;
  public toggled: boolean = false;
  constructor(
    public contactservice: ContactsService, public alertCtrl: AlertController,
    public alertservice: AlertsService,
    public route: Router) {
  }

  ngOnInit() {
    this.loadAllContacts()
  }
  /*
  async resetChanges() {
    this.filteredcontacts = this.temparr;
    await this.slidingList.closeSlidingItems();
  }
  async searchuser(searchbar) {
    this.filteredcontacts = this.temparr;
    //console.log('filtered', this.filteredcontacts);
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }
    this.filteredcontacts = this.filteredcontacts.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true; 
      }
      return false;
    })
    await this.slidingList.closeSlidingItems();
  }
  */
  async addContact() {
    this.route.navigateByUrl('tabs/(contacts:contact-add)');
    await this.slidingList.closeSlidingItems();
  }
  async viewContact(contact) {
    console.log('here we go', contact);
    this.route.navigateByUrl(`tabs/(contacts:contact-details/${contact})`);
    await this.slidingList.closeSlidingItems();
  }

  async messageContact(contact) {
    console.log('prenav', contact);
    this.route.navigateByUrl(`tabs/(messages:message-details/${contact.uid}/${contact.displayName})`);
    await this.slidingList.closeSlidingItems();
  }
  async deleteContact(uid) {
    console.log('uid', uid);
    this.contactservice.deleteContact(uid).then(() => {
      this.alertservice.toastMessage('User Deleted','toast');
    }).catch((err) => {
      console.log(err)
    })
    await this.slidingList.closeSlidingItems();
  }
  search($event) {
    this.toggled = true;
    let q = $event.target.value;
    if (q != '') {
      console.log('q',q)
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.contacts = [];
      this.toggled = false;
    }
  }
  resetChanges1() {
    this.contacts = [];
    this.toggled = false;
    this.contactservice.fullContacts = [];
  }
  loadAllContacts() {
    this.contactservice.getallContacts().subscribe((contacts) => {
      this.allContacts = contacts; 
    })
    combineLatest(this.startobs, this.endobs)
    .subscribe((value) => {
      this.contactservice.firequery(value[0], value[1]).subscribe((contacts) => {
        this.contacts = contacts;
      })
    })
  }
}