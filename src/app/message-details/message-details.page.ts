import { Component, OnInit,  ViewChild, NgZone } from '@angular/core';
import {  Events, Content, LoadingController  } from '@ionic/angular';
import { ImghandlerService } from '../imghandler.service';
import { AdminService } from '../admin.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { MessagesService } from '../messages.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.page.html',
  styleUrls: ['./message-details.page.scss'],
})
export class MessageDetailsPage implements OnInit {
  @ViewChild('content') content: Content;
  contact: any;
  newmessage;
  films: Observable<any>;
  imgornot;
  temppic;
  public cmg;
  public id = this.route.snapshot.paramMap.get('contact');
  public displayName = this.route.snapshot.paramMap.get('displayName');
  public photoURL = 'https://firebasestorage.googleapis.com/v0/b/ionic3chat-1cac4.appspot.com/o/no-avatar.png?alt=media&token=549cd7b9-e4fe-471c-873b-5bb57d4ac406';
  public adminPic;
  db = firebase.firestore(); 
  constructor( public messageservice: MessagesService,
    public events: Events, public zone: NgZone, public adminservice: AdminService, public loadingCtrl: LoadingController,
    public imgstore: ImghandlerService,public httpClient: HttpClient,
    public route: ActivatedRoute) {
      
     //this.scrollto();
     // this.events.subscribe('newmessage', () => {
        //this.imgornot = [];
       // this.zone.run(() => {
          
       // })
     // })
     
    
}

ngOnInit() {
  this.cmg = [];
  this.cmg = this.messageservice.loadAllContactMessages(this.id);
  //let that = this;
 // setTimeout(()=>{that.content.scrollToBottom();},2000); 
}

/*
  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000); 
  }
  */
  addmessage() {  
   if (this.id) {
      this.messageservice.addmessage(this.id,this.newmessage); //add message to database
      //this.content.scrollToBottom(); //scroll to bottom after sending message
      this.messageservice.sendSMS(this.id,this.newmessage);  //send sms to contact
      this.newmessage = '';  //clear the text bar
     
    } 
  }
}
