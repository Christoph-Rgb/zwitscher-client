import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(ZwitscherService, EventAggregator)

export class Dashboard {

  timelineOptions = null;

  constructor(zs, ea) {
    this.zwitscherService = zs;
    this.eventAgregator = ea;

    this.timelineOptions = {
      src: 'globalTimeline',
      viewedUserID: this.zwitscherService.getLoggedInUser()._id,
    };
  }
}
