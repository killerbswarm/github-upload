import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
//import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
//import 'rxjs/add/operator/toPromise';
//import { Observable } from 'rxjs';
//import { Messages } from '../../models/interfaces/messages';
import { Admins } from './admin.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
import { collectionData, docData } from 'rxfire/firestore';
import { combineLatest } from 'rxjs'; 
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders,HttpErrorResponse } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  contact: any;
  contactMessages = [];
  public allmessages = [];
  MessagesRef = this.afs.collection('messages');
  public db = firebase.firestore();
  tempmsg = [];
  tempMessageList = [];
  //public allmessages = []; 
  public adminPic;
  //adminPic:any = [];
  adminObv:Admins;
  apiUrl = 'https://swarmsms.glitch.me';
  public systemMessage = 'f3387lv7c2OwcAbI2ZBbjoIpM7k2';
  public ts;
  constructor(public events: Events,public afs: AngularFirestore,public httpClient: HttpClient) {
  
  }
  getAdminPicture(sentby){ 
    this.adminPic = null;
    console.log('adminpic here',sentby);
    const tempAdminPic = this.db.doc(`admins/${sentby}`);
    docData(tempAdminPic)
    .subscribe(admin => {
        console.log('getmessages-admin',admin);
        //this.myMessages = c;
        this.adminPic = admin['photoURL']; 
      });
   }
  getMessagesList(){
    this.tempmsg= [];
    const precity = this.db.collection('messages')
    .orderBy('timestamp', 'desc')
    collectionData(precity, 'id')
    // this is new
    .pipe(
      switchMap(message => {
        return combineLatest(...message
        .map(
        c => { 
        let cid = c['id'];
        const ref = this.db.doc(`contacts/${cid}`)
        return docData(ref).pipe(map(contact => ({contact, ...c })));
        }));
      })
    )
    //this is new
    .subscribe(amsg => {
    this.tempMessageList = [];
      amsg.forEach(c => {
        this.tempMessageList.push(c);
        })
      
      }); 
  }
 loadAllContactMessages(cid) {
  this.allmessages = [];
  this.db.collection('messages').doc(cid).update({read: true})
  const messageList = this.db.collection('messages').doc(cid).collection('messages')
  .orderBy('timestamp', 'asc')
  collectionData(messageList)
  .pipe( 
    switchMap(contact => {
      return combineLatest(...contact
        .map(
        a => {
        let asentby = a['sentby'];
        const ref = this.db.doc(`admins/${asentby}`);
        return docData(ref).pipe(map(admin => ({admin, ...a})));
      }));
    })
    ) 
  .subscribe(message => {
    this.allmessages= [];
    message.forEach(c => {
      console.log(c)
      if (!c['timestamp']){
        c['timestamp'] = firebase.firestore.FieldValue.serverTimestamp()
        //c['date'] = c['timestamp'].toDate(); 
        console.log(c['time stamp added']);
      }else{
        c['date'] = c['timestamp'].toDate();
        console.log(c['date']);
      }
      if (!c['read']) { 
        console.log('message read')
        this.db.collection('messages').doc(c['uid']).collection('messages').doc(c['mid'])
        .update({read: true})   //update database to mark message as read
        this.db.collection('messages').doc(c['uid'])
        .update({read: true})   //update database to mark message collection as read
      } 
    this.allmessages.push(c);
    })
  })
}
addmessage(uid,msg) {  
  if (uid) {
    this.db.collection('messages').doc(uid).collection('messages').add({
      uid: uid,
      sentby: firebase.auth().currentUser.uid,
      sentto: uid,
      message: msg,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      read: true,
    }).then( docRef => {
      this.db.collection('messages').doc(uid).collection('messages').doc(docRef.id).update({
        mid: docRef.id,
      })})
    this.db.collection('messages').doc(uid).set({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: msg,
      read: true,
    })
  } 
} 
smsTest(data)  {
  const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
  this.httpClient.post(this.apiUrl+'/sms/send',data,  {headers: headers, responseType: 'text'} ).subscribe(
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
  
  //this.httpClient.post(this.apiUrl+'/sms/send', JSON.stringify(data))
sendSMS(uid,msg){
  //get user phone number 
  const sendText = this.db.doc(`contacts/${uid}`);
   docData(sendText)
   .subscribe(contact => {
       //console.log('contact',contact);
       let messageInfo = {
        phone: contact['phone'],
        message: msg,
      };
      //console.log('sms-info',messageInfo)
     this.smsTest(messageInfo);
     });
  }
}