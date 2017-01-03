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

  register(e) {
    this.zwitscherService.register(this.firstName, this.lastName, this.email, this.password, this.gender).then(newUser => {
      this.zwitscherService.login(this.email, this.password);
    }).catch(err => {
      console.log(err);
    });
  }
}
