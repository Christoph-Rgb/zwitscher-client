import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TweetUpdate} from '../../services/messages';

@inject(ZwitscherService, EventAggregator)
export class UserTimeline {

  timelineOptions = {};

  constructor(zs, ea) {
    this.zwitscherService = zs
    this.eventAgregator = ea;

    this.timelineOptions.src = 'userTimeline';
  }

  activate(payload) {
    if (payload && payload.id) {
      this.timelineOptions.viewedUserID = payload.id;
    } else {
      this.timelineOptions.viewedUserID = this.zwitscherService.loggedInUser._id;
    }

  }
}
