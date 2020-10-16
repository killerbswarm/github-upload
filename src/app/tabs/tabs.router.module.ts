import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
//import { HomePage } from '../home/home.page';
import { MessagesPage } from '../messages/messages.page';
import { ProfilePage } from '../profile/profile.page';
import { LoginPage } from '../login/login.page';
import { ContactsPage } from '../contacts/contacts.page';
import { ContactAddPage } from '../contact-add/contact-add.page';
import { ContactDetailsPage } from '../contact-details/contact-details.page';
import { AuthGuard } from '../auth.guard';
import { MessageDetailsPage } from '../message-details/message-details.page';
import { PunchcardPage } from '../punchcard/punchcard.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(messages:messages)',
        pathMatch: 'full',
      },
      {
        path: 'messages',
        outlet: 'messages',
        component: MessagesPage,
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts',
        outlet: 'contacts',
        component: ContactsPage,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        outlet: 'profile',
        component: ProfilePage,
        canActivate: [AuthGuard]
      },
      {
        path: 'punchcard',
        outlet: 'punchcard',
        component: PunchcardPage,
        canActivate: [AuthGuard]
      },
      { path: "contact-add", 
        component: ContactAddPage, 
        outlet: "contacts",
        canActivate: [AuthGuard]
     
      },
      { path: "contact-details/:contact", 
        component: ContactDetailsPage, 
        outlet: "contacts", 
        canActivate: [AuthGuard]
      },
      { path: "message-details/:contact", 
      component: MessageDetailsPage, 
      outlet: "messages", 
      canActivate: [AuthGuard]
    },
    { path: "message-details/:contact/:displayName", 
      component: MessageDetailsPage, 
      outlet: "messages", 
      canActivate: [AuthGuard]
    },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(messages:messages)',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
