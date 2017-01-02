import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TweetUpdate} from '../../services/messages';

@inject(ZwitscherService, EventAggregator)
export class GlobalTimeline {

  tweets = [];
  loggedInUser = {};
  userID = '';

  constructor(zs, ea) {
    this.zwitscherService = zs
    this.eventAgregator = ea;
    this.loggedInUser = this.zwitscherService.loggedInUser;
    this.userID = this.loggedInUser._id;

    this.eventAgregator.subscribe(TweetUpdate, msg => {
      this.refreshTimeline();
    });
  }

  attached() {
    this.refreshTimeline();
  }

  deleteTweet(tweetToDeleteID) {
    this.zwitscherService.deleteTweet(tweetToDeleteID).then(result => {
      const indexToRemove = this.tweets.findIndex(tweet => {
        return tweet._id === tweetToDeleteID;
      });

      if (indexToRemove > -1) {
        this.tweets.splice(indexToRemove, 1);
        this.eventAgregator.publish(new TweetUpdate({}));
        console.log('tweet deleted successfully');
      }
    }).catch(err => {
      console.log('tweet could not be deleted');
    })
  }

  refreshTimeline(){
    this.tweets = [];
    this.zwitscherService.getTweets().then(tweets => {

      tweets.sort((tweet1, tweet2) => {
        const posted1 = new Date(tweet1.posted);
        const posted2 = new Date(tweet2.posted);

        return posted2.getTime() - posted1.getTime();
      });

      tweets.forEach(tweet => {
        tweet.postedString = new Date(tweet.posted).toLocaleString('en-GB');
        tweet.canDelete = this.loggedInUser._id === tweet.user._id || this.loggedInUser.scope === 'admin';
        this.tweets.push(tweet);
      })

      console.log(this.tweets);
    });
  }
}
