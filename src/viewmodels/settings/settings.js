import {EventAggregator} from 'aurelia-event-aggregator';
import ZwitscherService from '../../services/zwitscher-service';
import {inject} from 'aurelia-framework';
import {LoggedInUserUpdate} from '../../services/messages';

@inject(EventAggregator, ZwitscherService)
export class Settings {

  loggedInUser = {};

  constructor(ea, zs) {
    this.ea = ea;
    this.zwitscherService = zs;

    this.refreshUser();

    // this.ea.subscribe(LoggedInUserUpdate, msg => {
    //   this.refreshUser();
    // });
  }

  update() {
    this.zwitscherService.updateUser(this.loggedInUser).then(updatedUser => {
      this.loggedInUser = updatedUser;
      this.loggedInUser.oldPassword = '';
      this.loggedInUser.password = '';
      this.ea.publish(new LoggedInUserUpdate({}));
    }).catch(err => {
      console.log('error updating user');
      this.refreshUser();
    });
  }

  refreshUser() {
    this.loggedInUser = this.zwitscherService.getLoggedInUser();
    this.loggedInUser.oldPassword = '';
    this.loggedInUser.password = '';
  }
}
