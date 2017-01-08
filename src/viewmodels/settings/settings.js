import {EventAggregator} from 'aurelia-event-aggregator';
import ZwitscherService from '../../services/zwitscher-service';
import {inject} from 'aurelia-framework';
import {CompletedLoggedInUserUpdate, TriggerLoggedInUserUpdate} from '../../services/messages';

@inject(EventAggregator, ZwitscherService)
export class Settings {

  loggedInUser = {};

  eventSubscriptions = [];

  constructor(ea, zs) {
    this.eventAgregator = ea;
    this.zwitscherService = zs;
  }

  attached() {
    this.eventSubscriptions = [];
    this.eventSubscriptions.push (this.eventAgregator.subscribe(CompletedLoggedInUserUpdate, msg => {
      this.refreshUser()
    }));
    this.refreshUser();
    initializeFormValidation(this.update.bind(this), null);
  }

  detached() {
    this.eventSubscriptions.forEach(event => {
      event.dispose();
    })
  }

  update() {
    if (this.loggedInUser.password === '') {
      this.loggedInUser.password = this.loggedInUser.oldPassword;
    }

    this.zwitscherService.updateUser(this.loggedInUser).then(updatedUser => {
      //refreshes the token after user was updated
      this.zwitscherService.reAuhtenticate(updatedUser.email, updatedUser.password);
      this.eventAgregator.publish(new TriggerLoggedInUserUpdate({}));
    }).catch(err => {
      console.log('error updating user');
      this.refreshUser();
    });
  }

  refreshUser() {
    this.loggedInUser = this.zwitscherService.getLoggedInUser();
    this.loggedInUser.oldPassword = '';
    this.loggedInUser.password = '';
    this.loggedInUser.passwordConfirm = '';
  }
}

function initializeFormValidation(onSuccessFunction, onFailureFunction) {
  $('#settingsForm')
    .form({
      on: 'submit',
      inline: true,
      onSuccess: function(event){
        //prevents redirect
        event.preventDefault();
        onSuccessFunction();
      },
      onFailure: function(){
        onFailureFunction();
        return false;
      },
      fields: {
        firstName: {
          identifier  : 'firstName',
          rules: [
            {
              type   : 'empty',
              prompt : 'Enter your first name'
            }
          ]
        },
        lastName: {
          identifier  : 'lastName',
          rules: [
            {
              type   : 'empty',
              prompt : 'Enter your last name'
            }
          ]
        },
        gender: {
          identifier  : 'gender',
          rules: [
            {
              type   : 'empty',
              prompt : 'Provide your gender'
            }
          ]
        },
        email: {
          identifier  : 'email',
          rules: [
            {
              type   : 'email',
              prompt : 'Enter valid email address'
            }
          ]
        },
        oldPassword: {
          identifier  : 'oldPassword',
          rules: [
            {
              type   : 'empty',
              prompt : 'Enter old password'
            }
          ]
        },
        password: {
          identifier  : 'password',
          optional: true,
          rules: [
            {
              type   : 'empty',
              prompt : 'Enter password'
            },
            {
              type   : 'minLength[6]',
              prompt : 'Password must be 6 or more characters'
            }
          ]
        },
        passwordConfirm: {
          identifier  : 'passwordConfirm',
          optional: true,
          rules: [
            {
              type   : 'match[password]',
              prompt : 'Passwords do not match'
            }
          ]
        }
      }
    })
  ;
}
