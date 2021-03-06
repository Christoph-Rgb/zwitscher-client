import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TweetUpdate} from '../../services/messages';

@inject(ZwitscherService, EventAggregator)
export class GlobalTimeline {

  timelineOptions = {};
  // loggedInUser = {};

  constructor(zs, ea) {
    this.zwitscherService = zs;
    this.eventAgregator = ea;

    // this.loggedInUser = this.zwitscherService.loggedInUser;

    this.timelineOptions = {
      src: 'globalTimeline',
      viewedUserID: this.zwitscherService.getLoggedInUser()._id,
    };
  }
}
