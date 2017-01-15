import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';

@inject(ZwitscherService)
export class Login {

  constructor(zs) {
    this.zwitscherService = zs;
    this.prompt = '';
  }

  attached(){
    initializeFormValidation(this.login.bind(this), null);

    $('#loginForm').on('submit', function () {
      $('#loginForm').addClass('loading disabled');
    });
  }

  login() {
    console.log(`Trying to log in ${this.email}`);

    this.zwitscherService.login(this.email, this.password);
  }
}

function initializeFormValidation(onSuccessFunction, onFailureFunction) {
  $('#loginForm')
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
            }
          ]
        }
      }
    })
  ;
}
