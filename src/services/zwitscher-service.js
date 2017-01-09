import {inject} from 'aurelia-framework';
import {TotalUpdate, LoginStatus, TriggerLoggedInUserUpdate, CompletedLoggedInUserUpdate} from './messages';
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

    ea.subscribe(TriggerLoggedInUserUpdate, msg => {
      this.getUser(this.loggedInUser._id).then(refreshedUser => {
        this.loggedInUser = refreshedUser;
        ea.publish(new CompletedLoggedInUserUpdate({}));
      }).catch(err => {
        console.log('error refreshing user');
      });
    });
  }

  getLoggedInUser() {
    return JSON.parse(JSON.stringify(this.loggedInUser));
  }

  getUser(userID){
    return new Promise((resolve, reject) => {
      this.ac.get('/api/users/' + userID).then(result => {

        resolve(JSON.parse(result.response));

      }).catch(err => {
        reject(err);
      });
    });
  }

  getUsers() {
    return new Promise((resolve, reject) => {
      this.ac.get('/api/users').then(result => {

        let users = [];
        if(result.statusCode === 200){
          users = JSON.parse(result.response);
        }
        resolve(users);

      }).catch(err => {
        reject(err);
      });
    });
  }

  register(firstName, lastName, email, password, gender) {
    return new Promise((resolve, reject) => {
      const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        gender: gender,
      };
      this.ac.post('/api/users', newUser).then(res => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(res.response));
        } else {
          reject('error creating user');
        }

      });
    }).catch(err => {
      reject(err);
    });


  }

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.ac.login('/api/users/authenticate', user);
  }

  logout() {
    const status = {
      success: false,
      message: ''
    };
    this.ac.clearAuthentication();
    this.ea.publish(new LoginStatus(status));
  }

  reAuhtenticate(email, password) {
    const user = {
      email: email,
      password: password
    };
    // this.ac.clearAuthentication();
    this.ac.authenticate('/api/users/authenticate', user);
  }

  isAuthenticated() {
    return this.ac.isAuthenticated();
  }

  getTweetsForUser() {
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

  getTweetsByUser(userID) {
    return new Promise((resolve, reject) => {
      this.ac.get('/api/users/' + userID + '/tweets').then(result => {

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

  deleteMultipleTweets(tweetsToDelete) {
    return new Promise((resolve, reject) => {
      this.ac.post('/api/deleteTweetsJob/' + JSON.stringify(tweetsToDelete)).then(result => {
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

  unfollowUser(userID) {
    return new Promise((resolve, reject) => {
      this.ac.post('/api/users/' + userID + '/unfollow').then(result => {
        if(result.statusCode === 201) {
          resolve(result.response);
        } else {
          reject(null);
        }
      });
    });
  }

  followUser(userID) {
    return new Promise((resolve, reject) => {
      this.ac.post('/api/users/' + userID + '/follow').then(result => {
        if(result.statusCode === 201) {
          resolve(result.response);
        } else {
          reject(null);
        }
      });
    });
  }

  updateUser(updatedUser) {
    return new Promise((resolve, reject) => {
      this.ac.post('/api/users/' + updatedUser._id + '/update', updatedUser).then(result => {
        if(result.statusCode === 201) {
          resolve(JSON.parse(result.response));
        } else {
          reject(null);
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  removeUser(userID) {
    return new Promise((resolve, reject) => {
      this.ac.delete('/api/users/' + userID).then(result => {
        if(result.statusCode === 204) {
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
