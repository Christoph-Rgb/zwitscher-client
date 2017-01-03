import {EventAggregator} from 'aurelia-event-aggregator';
import ZwitscherService from '../../services/zwitscher-service';
import {inject} from 'aurelia-framework';
import {CompletedLoggedInUserUpdate, TriggerLoggedInUserUpdate} from '../../services/messages';

@inject(EventAggregator, ZwitscherService)
export class Settings {

  loggedInUser = {};

  eventSubscriptions = [];

  constructor(ea, zs) {
    this.eventAgregator = ea;
    this.zwitscherService = zs;
  }

  attached() {
    this.eventSubscriptions = [];
    this.eventSubscriptions.push (this.eventAgregator.subscribe(CompletedLoggedInUserUpdate, msg => {
      this.refreshUser()
    }));
    this.refreshUser();
  }

  detached() {
    this.eventSubscriptions.forEach(event => {
      event.dispose();
    })
  }

  update() {
    this.zwitscherService.updateUser(this.loggedInUser).then(updatedUser => {
      //refreshes the token after user was updated
      //forces redirect to globalTimeline :(
      this.zwitscherService.login(updatedUser.email, updatedUser.password);
      this.eventAgregator.publish(new TriggerLoggedInUserUpdate({}));
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
