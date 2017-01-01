import ZwitscherService from '../../services/zwitscher-service';
import {inject} from 'aurelia-framework';

@inject(ZwitscherService)
export class Logout {

  constructor(zs) {
    this.zwitscherService = zs;
  }

  logout() {
    console.log('logging out');
    this.zwitscherService.logout();
  }
}
