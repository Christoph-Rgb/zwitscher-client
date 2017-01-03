import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UsersChanged} from '../../services/messages';

@inject(ZwitscherService, EventAggregator)
export class GlobalTimeline {

  users = [];
  loggedInUser = {};
  eventSubscriptions = [];

  constructor(zs, ea) {
    this.zwitscherService = zs
    this.eventAgregator = ea;
    this.loggedInUser = this.zwitscherService.loggedInUser;
  }

  attached() {
    this.eventSubscriptions = [];
    this.eventSubscriptions.push(this.eventAgregator.subscribe(UsersChanged, msg => {
      this.refreshUsers();
    }));
    this.refreshUsers();
  }

  detached() {
    this.eventSubscriptions.forEach(event => {
      event.dispose();
    })
  }

  refreshUsers(){
    this.zwitscherService.getUsers().then(foundUsers => {
      this.users = foundUsers;
    }).catch(err => {
      console.log('error while searching for users');
    })
  }
}
