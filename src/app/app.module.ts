import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router,Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { AngularFirestoreModule } from 'angularfire2/firestore';
//firebase imports
import { environment } from '../environments/environment';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFirestoreModule } from '@angular/fire/firestore'; 
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage'
//services, guards, components
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
//other modules
import { HttpClientModule } from '@angular/common/http';
import { AutoresizeComponent } from './autoresize/autoresize.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoresizeComponent  
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({
      tabbarPlacement: "bottom",
    }), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireMessagingModule,
    AngularFireStorageModule,
    HttpClientModule
  ],
  providers: [ 
    StatusBar,
    SplashScreen,
    AuthService,
    AuthGuard,
    AngularFireModule,
    AngularFirestoreModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
