import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { admincreds } from './admin.service';

@Injectable({
  providedIn: 'root'
}) 
export class AuthService {
  user: Observable<firebase.User>
  constructor(private firebaseAuth: AngularFireAuth,private route: Router) {
    this.user = firebaseAuth.authState;
  }
  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });    
  }

  login(credentials: admincreds) {
    console.log(credentials);
    var promise = new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
       })
    })

    return promise;
    
  }
 
  logout() {
    this.firebaseAuth
      .auth
      .signOut();
      //console.log(this.user)
  }
  public signOut(): Promise<void> {
    this.firebaseAuth.auth.signOut();
    this.route.navigateByUrl('/login');
    return
  }
  resetPassword() {
    this.firebaseAuth.user.subscribe(user => {
      if (user){
        this.firebaseAuth.auth.sendPasswordResetEmail(user.email).then(function() {
      // Email sent.
      console.log('email sent to:', user.email)
    }).catch(function(error) {
      // An error happened.
    });
    }
  })
  }
}