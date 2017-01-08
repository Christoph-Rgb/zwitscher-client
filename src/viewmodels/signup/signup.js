import {EventAggregator} from 'aurelia-event-aggregator';
import ZwitscherService from '../../services/zwitscher-service';
import {inject} from 'aurelia-framework';
import {LoginStatus} from '../../services/messages';

@inject(EventAggregator, ZwitscherService)
export class Signup {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  gender = 'M';

  constructor(ea, zs) {
    this.ea = ea;
    this.zwitscherService = zs;
  }

  attached() {
    initializeFormValidation(this.register.bind(this), null);
  }

  register() {
    this.zwitscherService.register(this.firstName, this.lastName, this.email, this.password, this.gender).then(newUser => {
      this.zwitscherService.login(this.email, this.password);
    }).catch(err => {
      console.log(err);
    });
  }
}

function initializeFormValidation(onSuccessFunction, onFailureFunction) {
  $('#signupForm')
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
        password: {
          identifier  : 'password',
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
