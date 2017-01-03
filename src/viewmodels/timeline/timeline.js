import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TweetUpdate, CompletedLoggedInUserUpdate} from '../../services/messages';

@inject(ZwitscherService, EventAggregator)
export class Timeline {

  tweets = [];
  src = '';
  loggedInUser = {};
  timelineUser = {};
  timelineUserID = '';

  eventSubscriptions = [];

  constructor(zs, ea) {
    this.zwitscherService = zs
    this.eventAgregator = ea;
    this.loggedInUser = this.zwitscherService.getLoggedInUser();
  }

  activate(timelineOptions) {
    console.log(timelineOptions);
    this.timelineUserID = timelineOptions.viewedUserID;
    this.src = timelineOptions.src;
    this.zwitscherService.getUser(timelineOptions.viewedUserID).then(foundUser => {
      this.timelineUser = foundUser;
    }).catch(err => {
      console.log(err);
    });
  }

  attached() {
    this.eventSubscriptions = [];
    this.eventSubscriptions.push (this.eventAgregator.subscribe(TweetUpdate, msg => {
      this.refreshTimeline();
    }));
    this.eventSubscriptions.push (this.eventAgregator.subscribe(CompletedLoggedInUserUpdate, msg => {
      this.refreshTimeline();
      if (this.timelineUserID === this.loggedInUser._id){
        this.loggedInUser = this.zwitscherService.getLoggedInUser();
        this.timelineUser = this.zwitscherService.getLoggedInUser();
      }
    }));

    this.refreshTimeline();
  }

  detached() {
    this.eventSubscriptions.forEach(event => {
      event.dispose();
    })
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

    // let getTweets;
    let getTweetFunctionName = '';
    if (this.src === 'globalTimeline'){
      // getTweets = this.zwitscherService.getTweetsForUser;
      getTweetFunctionName = 'getTweetsForUser';
    } else {
      // getTweets = this.zwitscherService.getTweetsByUser;
      getTweetFunctionName = 'getTweetsByUser';
    }

    this.zwitscherService[getTweetFunctionName](this.timelineUserID).then(tweets => {

      tweets.sort((tweet1, tweet2) => {
        const posted1 = new Date(tweet1.posted);
        const posted2 = new Date(tweet2.posted);

        return posted2.getTime() - posted1.getTime();
      });

      tweets.forEach(tweet => {
        tweet.postedString = new Date(tweet.posted).toLocaleString('en-GB');
        tweet.canDelete = (tweet.user !== null && this.loggedInUser._id === tweet.user._id) || this.loggedInUser.scope === 'admin';
        this.tweets.push(tweet);
      })

      console.log(this.tweets);
    });
  }
}
