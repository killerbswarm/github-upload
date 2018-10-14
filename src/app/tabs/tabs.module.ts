import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { LoginPageModule } from '../login/login.module';
import { ContactsPageModule } from '../contacts/contacts.module';
import { MessagesPageModule } from '../messages/messages.module';
import { ProfilePageModule } from '../profile/profile.module'; 
import { ContactAddPageModule } from '../contact-add/contact-add.module';
import { ContactDetailsPageModule } from '../contact-details/contact-details.module';
import { MessageDetailsPageModule } from '../message-details/message-details.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    LoginPageModule, 
    ContactsPageModule,
    MessagesPageModule,
    ProfilePageModule,
    ContactAddPageModule,
    ContactDetailsPageModule,
    MessageDetailsPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
