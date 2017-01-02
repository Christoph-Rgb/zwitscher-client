import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TweetUpdate} from '../../services/messages';

@inject(ZwitscherService, EventAggregator)
export class User {

  loggedInUser = {};
  viewedUserID = '';
  viewedUser = {};

  constructor(zs,ea) {
    this.zwitscherService = zs;
    this.eventAgregator = ea;
    this.loggedInUser = this.zwitscherService.loggedInUser;

    this.eventAgregator.subscribe(TweetUpdate, msg => {
      this.refreshUser();
    });
  }

  activate(userID) {
    console.log(userID);
    this.viewedUserID = userID;
    this.refreshUser();
  }

  refreshUser(){
    this.zwitscherService.getUser(this.viewedUserID).then(foundUser => {
      this.viewedUser = foundUser;
      this.viewedUser.joinedString = new Date(this.viewedUser.joined).getFullYear();
      this.viewedUser.canFollow = this.loggedInUser._id !== this.viewedUserID;

      //check if loggedInUser is following current user
      var indexOfFollowing = this.loggedInUser.follows.findIndex(followedUserID => {
        return this.viewedUser._id === followedUserID;
      });
      this.loggedInUser.isFollowing = indexOfFollowing !== -1;

      //check if user can be deleted (admin function)
      let canDelete = false;
      if (this.loggedInUser._id !== this.viewedUserID &&
          this.loggedInUser.scope === 'admin') {
        canDelete = true;
      }
      this.viewedUser.canDelete = canDelete;

      console.log(foundUser);
    }).catch(err => {
      console.log('viewedUser not found');
      console.log(err);
    });
  }
}
