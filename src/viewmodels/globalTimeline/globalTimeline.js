import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';

@inject(ZwitscherService)
export class GlobalTimeline {

  tweets = [];
  loggedInUser = {};

  constructor(zs) {
    this.zwitscherService = zs
    this.loggedInUser = this.zwitscherService.loggedInUser;
  }

  attached() {
    this.zwitscherService.getTweets().then(tweets => {

      tweets.forEach(tweet => {
        tweet.postedString = new Date(tweet.posted).toLocaleString('en-GB');
        tweet.canDelete = this.loggedInUser._id === tweet.user._id;
        this.tweets.push(tweet);
      })

      console.log(this.tweets);
    });
  }

  deleteTweet(tweetToDeleteID) {
    this.zwitscherService.deleteTweet(tweetToDeleteID).then(result => {
      const indexToRemove = this.tweets.findIndex(tweet => {
        return tweet._id === tweetToDeleteID;
      });

      if (indexToRemove > -1) {
        this.tweets.splice(indexToRemove, 1);
        console.log('tweet deleted successfully');
      }
    }).catch(err => {
      console.log('tweet could not be deleted');
    })
  }
}
