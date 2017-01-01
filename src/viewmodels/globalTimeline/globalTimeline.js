import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';

@inject(ZwitscherService)
export class GlobalTimeline {

  tweets = [];

  constructor(zs) {
    this.zwitscherService = zs;
  }

  attached() {
    this.zwitscherService.getTweets().then(tweets => {

      tweets.forEach(tweet => {
        tweet.postedString = new Date(tweet.posted).toLocaleString('en-GB');
        this.tweets.push(tweet);
      })

      console.log(this.tweets);
    });
  }
}
