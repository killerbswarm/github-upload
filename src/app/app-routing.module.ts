import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'messages', loadChildren: './messages/messages.module#MessagesPageModule' },
  { path: 'contacts', loadChildren: './contacts/contacts.module#ContactsPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'contact-add', loadChildren: './contact-add/contact-add.module#ContactAddPageModule' },
  { path: 'contact-details', loadChildren: './contact-details/contact-details.module#ContactDetailsPageModule' },
  { path: 'message-details', loadChildren: './message-details/message-details.module#MessageDetailsPageModule' },
  { path: 'punchcard', loadChildren: './punchcard/punchcard.module#PunchcardPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
