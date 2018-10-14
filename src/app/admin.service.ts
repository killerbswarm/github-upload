import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
//import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import { Admins } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  AdminsRef = this.afs.collection('admins');
  admins: Observable<Admins[]>; 
  public adminPic: any;
  constructor( public afs: AngularFirestore, 
    public afireauth: AngularFireAuth) {
  }

  addadmin(newadmin) {
   var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.createUserWithEmailAndPassword(newadmin.email, newadmin.password).then(() => {
        this.afireauth.auth.currentUser.updateProfile({
          displayName: newadmin.displayName,
          photoURL: ''
        }).then(() => {
          this.AdminsRef.doc(this.afireauth.auth.currentUser.uid).set({uid: this.afireauth.auth.currentUser.uid,
            displayName: newadmin.displayName,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/ionic3chat-1cac4.appspot.com/o/no-avatar.png?alt=media&token=549cd7b9-e4fe-471c-873b-5bb57d4ac406' }).then(() => {
            resolve({ success: true });
            }).catch((err) => {
              reject(err);
          })
          }).catch((err) => {
            reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  updateImage(imageurl) {
    var promise = new Promise((resolve, reject) => {
    this.AdminsRef.doc(firebase.auth().currentUser.uid).update({ photoURL: imageurl }).then(() => {
    resolve({ success: true });
    }).catch((err) => {
      reject(err);
    })
  })
  return promise;
}
getAdminDetails(): AngularFirestoreDocument<Admins> {
  console.log(firebase.auth().currentUser.uid)
  return this.AdminsRef.doc(firebase.auth().currentUser.uid);
}

updatedisplayname(newname) {
  var promise = new Promise((resolve, reject) => {
    this.afireauth.auth.currentUser.updateProfile({
    displayName: newname,
    photoURL: this.afireauth.auth.currentUser.photoURL
  }).then(() => {
    this.AdminsRef.doc(firebase.auth().currentUser.uid).update({
      displayName: newname,
     }).then(() => {
      resolve({ success: true });
    }).catch((err) => {
      reject(err);
    })
    }).catch((err) => {
      reject(err);
  })
  })
  return promise;
}
}
export interface Admins {
  displayName: string;
  photoURL: string;
  uid: string;
}
export interface AdminPic {
 photoURL: string;
}
export interface admincreds {
  email: string;
  password: string;
}