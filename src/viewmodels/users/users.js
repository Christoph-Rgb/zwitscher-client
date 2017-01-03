import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UsersChanged} from '../../services/messages';

@inject(ZwitscherService, EventAggregator)
export class GlobalTimeline {

  users = [];
  loggedInUser = {};

  constructor(zs, ea) {
    this.zwitscherService = zs
    this.eventAgregator = ea;
    this.loggedInUser = this.zwitscherService.loggedInUser;

    this.eventAgregator.subscribe(UsersChanged, msg => {
      this.refreshUsers();
    });
  }

  attached() {
    this.refreshUsers();
  }

  refreshUsers(){
    this.zwitscherService.getUsers().then(foundUsers => {
      this.users = foundUsers;
    }).catch(err => {
      console.log('error while searching for users');
    })
  }
}
