import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs'

// Import firebase to fix temporary bug in AngularFire
//import * as app from 'firebase/app';
//const _messaging = app.messaging();
//_messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
//_messaging.onMessage = _messaging.onMessage.bind(_messaging);

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  token;
  constructor(
    private afMessaging: AngularFireMessaging,
    private fun: AngularFireFunctions,
    private toastController: ToastController
  ) {}
  async makeToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'dismiss'
    });
    toast.present();
  }
  async tokenToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'dismiss'
    });
    toast.present();
  }
  requestPermission() {
   return this.afMessaging.requestToken
      .subscribe(
        (token) => { 
          this.token = token,
            //let message = "Token was successful";
            this.tokenToast("Token was successful");
          console.log('Permission granted! Save to the server!', token); },
        (error) => { 
            //let message = "Token Failed";
            this.tokenToast("Token Failed");
          console.error(error); },  
      );
  }
  /*  tutorial code that didn't work for some reason
  getPermission(): Observable<any>  {
    return this.afMessaging.requestToken.pipe(
      tap(token => (this.token = token))
    )
  }
  */
  showMessages(): Observable<any> {
    return this.afMessaging.messages.pipe(
      tap(msg => {
        const body: any = (msg as any).notification.body;
        this.makeToast(body);
      }) 
    );
  }
  sub(topic) {
    this.fun
      .httpsCallable('subscribeToTopic')({ topic, token: this.token })
      .pipe(tap(_ => this.makeToast(`subscribed to ${topic}`)))
      .subscribe();
  }
  
  unsub(topic) {
    this.fun
      .httpsCallable('unsubscribeFromTopic')({ topic, token: this.token })
      .pipe(tap(_ => this.makeToast(`unsubscribed from ${topic}`)))
      .subscribe();
  }
}
