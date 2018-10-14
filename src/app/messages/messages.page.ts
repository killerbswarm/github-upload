import { Component, OnInit, NgZone } from '@angular/core';

import { AuthService } from '../auth.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Events, AlertController } from '@ionic/angular';
import { MessagesService } from '../messages.service';
import { ContactsService } from '../contacts.service'
//import { Messages } from '../../models/interfaces/messages';
//import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
//import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/mergeMap';
//import { collectionData, docData } from 'rxfire/firestore';
import { Router} from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  myMessages;
  myContact; 
  contact1;
  public id;
  tempmsg = [];
  public tempid;
  public appParameters;
  public db = firebase.firestore();
  public myContactList;
  public myContacts;

  constructor(public authService: AuthService,
    public contactservice: ContactsService, public zone: NgZone, public messageservice: MessagesService, 
    public events: Events, public alertCtrl: AlertController,
    public route: Router
    ) { }

  ngOnInit() {
    console.log('messages page')
    this.myContactList = [];
      this.myContactList = this.messageservice.getMessagesList()
  }

  viewMessages(contact) {
    console.log('prenav',contact);
    this.route.navigateByUrl(`tabs/(messages:message-details/${contact.contact.uid}/${contact.contact.displayName})`);
    /*this.navCtrl.push('MessagesDetailsPage', {
      id: contact.contact.uid, 
      displayName: contact.contact.displayName,   
      photoURL: contact.contact.photoURL
    });
    */ 
  }
}

