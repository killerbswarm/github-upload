import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ContactsService, Contacts } from '../contacts.service';
import { Router } from '@angular/router';
import { PunchcardService, PunchCard } from '../punchcard.service';
import { List } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest } from 'rxjs'

@Component({
  selector: 'app-punchcard',
  templateUrl: './punchcard.page.html',
  styleUrls: ['./punchcard.page.scss'],
})
export class PunchcardPage implements OnInit {

  @ViewChild('slidingList') slidingList: List
  activeUser;
  punch;
  //search var
  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  contacts;
  allContacts;
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  filter;
  // end search var 
  public toggled: boolean = false;
  public punchCard;
  constructor(
    public contactservice: ContactsService,
    public punchcardservice: PunchcardService,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public route: Router,
    public afs: AngularFirestore) {
      this.toggled = false;
  }
  ngOnInit() {
    this.authService.user.subscribe(user => {
      if (user) { //user is authenticated
        this.activeUser = user.uid;
        console.log('user is logged in still', this.activeUser);
      }
      else {  //user not authenticated
        this.activeUser = null;
        console.log('user is logged out', this.activeUser);
        this.route.navigateByUrl('login');
      }
    })
    //this.punchcardservice.getAllActivePunchCards()
  
    this.punchcardservice.getallContacts().subscribe((contacts) => {
      this.allContacts = contacts; 
    })
    combineLatest(this.startobs, this.endobs)
    .subscribe((value) => {
      this.punchcardservice.firequery(value[0], value[1]).subscribe((contacts) => {
        this.contacts = contacts;
      })
    })
    this.allActivePunchCards();
    } 
  async editPunch(pc) {
    this.punchcardservice.editPunches(pc);
    await this.slidingList.closeSlidingItems();
  }
  async addPunch(pc) {
    this.punchcardservice.refillPunches(pc);
    await this.slidingList.closeSlidingItems();
  }
  async usePunch(pc) {
    this.punchcardservice.usePunches(pc);
    await this.slidingList.closeSlidingItems();
  }
  async addPunchToContact(contact) {
    await this.punchcardservice.addPunchToNew(contact);
    this.toggle();
  }
  async allActivePunchCards() {
    //this.punchCard = await this.punchcardservice.allActivePunchCards();
    this.punchCard = await this.punchcardservice.getPunchCards();
    //console.log(this.punchCard)
  }
  search($event) {
    let q = $event.target.value;
    if (q != '') {
      console.log('q',q)
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.contacts = [];
      //this.clubs = this.allclubs;
    }
  }
  resetChanges() {
    this.contacts = [];
  }
  public toggle(): void {
    this.toggled = !this.toggled;
    this.resetChanges()
 }
}


