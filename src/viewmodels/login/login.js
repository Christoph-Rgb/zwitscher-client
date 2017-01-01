import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';

@inject(ZwitscherService)
export class Login {

  constructor(zs) {
    this.zwitscherService = zs;
    this.prompt = '';
  }

  login(e) {
    console.log(`Trying to log in ${this.email}`);
    this.zwitscherService.login(this.email, this.password);
  }
}
