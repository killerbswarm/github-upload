import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController } from '@ionic/angular';
//import { ImghandlerService } from '../imghandler.service';
import { AdminService,  Admins  } from '../admin.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FcmService } from '../fcm.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  avatar: string;
  displayName: string;
  public admin: Observable<Admins>;
  downloadURL: Observable<string>;
  uid;
  constructor(
    public adminservice: AdminService,
    public alertCtrl: AlertController,
     public route: Router,
     //public imghandler: ImghandlerService, 
     public auth: AuthService,
     public fcm: FcmService,
     public storage: AngularFireStorage,
     public zone: NgZone) { }

  ngOnInit() {
    this.loadadmindetails();
  }
  loadadmindetails() {
    //const songId: string = this.route.snapshot.paramMap.get('id');
    this.admin = this.adminservice.getAdminDetails().valueChanges();
    this.admin.subscribe(data=>{
      console.log('data',data)
      this.displayName = data.displayName;
      this.uid = data.uid
      this.zone.run(() => {
        this.avatar = data.photoURL;
      })
  })

  }
  updateImage(event) {
    const file = event.target.files[0]; //console.log('file', file)
    const filePath = this.uid; //console.log('fp', filePath)
    const fileRef = this.storage.ref(filePath); //console.log('fileRef', fileRef)
    const task = this.storage.upload(filePath, file); //console.log('task',task)
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL()
          this.downloadURL.subscribe(val =>{
            this.adminservice.updateImage(val)
          }); 
        })
     )
    .subscribe()
  }
  async editname() {
    const statusalert = await this.alertCtrl.create({
      buttons: ['Name Updated']
    });
    let alert = await this.alertCtrl.create({
      header: 'Edit Display Name',
      inputs: [{
        name: 'nickname',
        placeholder: 'Display Name'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
      {
        text: 'Edit',
        handler: data => {
          if (data.nickname) {
            this.adminservice.updatedisplayname(data.nickname).then((res: any) => {
              if (res.success) {
                //statusalert.header['Updated']
                //statusalert.subHeader['Your Display has been changed successfully!!'];
                statusalert.present();
                this.zone.run(() => {
                  this.displayName = data.nickname;
                })
              }

              else {
               // statusalert.header['Failed'];
               // statusalert.subHeader['Your Disply Name was not changed'];
                statusalert.present();
              }
                             
            })
          }
        }
        
      }]
    });
    alert.present();
  }
  logout() {
    this.auth.signOut()
  }
  
}