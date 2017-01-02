import {inject} from 'aurelia-framework';
import Fixtures from './fixtures';
import {TotalUpdate, LoginStatus} from './messages';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';

@inject(EventAggregator, AsyncHttpClient)
export default class ZwitscherService {

  constructor(ea, ac) {
    this.ea = ea;
    this.ac = ac;
    this.loggedInUser = null;

    ea.subscribe(LoginStatus, msg => {
      if (msg.status.success === true) {
        this.loggedInUser = msg.status.user;
      } else {
        this.loggedInUser = null;
      }
    });
  }

  getUsers() {
    this.ac.get('/api/users').then(res => {
      this.users = res.content;
    });
  }

  register(firstName, lastName, email, password, gender) {
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      gender: gender,
    };
    this.ac.post('/api/users', newUser).then(res => {
      // this.getUsers();
      console.log(res);
    });
  }

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.ac.authenticate('/api/users/authenticate', user);
  }

  logout() {
    const status = {
      success: false,
      message: ''
    };
    this.ac.clearAuthentication();
    this.ea.publish(new LoginStatus(status));
  }

  isAuthenticated() {
    return this.ac.isAuthenticated();
  }

  getTweets() {
    return new Promise((resolve, reject) => {
      this.ac.get('/api/tweets/users/' + this.loggedInUser._id).then(result => {

        let tweets = [];
        if(result.statusCode === 200){
          tweets = JSON.parse(result.response);
        }

        resolve(tweets);
      });
    });
  }

  deleteTweet(tweetToDeleteID) {
    return new Promise((resolve, reject) => {
      this.ac.delete('/api/tweets/' + tweetToDeleteID).then(result => {
        if(result.statusCode === 204) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  };

  postTweet(tweet) {
    return new Promise((resolve, reject) => {
      this.ac.post('/api/tweets', tweet).then(result => {
        if(result.statusCode === 201) {
          resolve(result.response);
        } else {
          reject(null);
        }
      });
    });
  }

  getUser(userID) {
    return new Promise((resolve, reject) => {
      this.ac.get('/api/users/' + userID).then(result => {
        if(result) {
          resolve(JSON.parse(result.response));
        } else {
          reject(null);
        }
      });
    });
  };
}
