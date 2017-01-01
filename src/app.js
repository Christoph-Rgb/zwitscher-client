import {inject, Aurelia} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './services/messages';
import ZwitscherService from './services/zwitscher-service';

@inject(ZwitscherService, Aurelia, EventAggregator)
export class App {

  constructor(zs, au, ea) {
    this.au = au;
    this.zwitscherService = zs;
    ea.subscribe(LoginStatus, msg => {
      if (msg.status.success === true) {
        //see following thread
        //http://stackoverflow.com/questions/36247052/aurelia-clear-route-history-when-switching-to-other-app-using-setroot/40170520#40170520
        this.router.navigate('/', { replace: true, trigger: false});
        this.router.reset();
        this.router.deactivate();
        au.setRoot('home').then(() => {
          this.router.navigateToRoute('globalTimeline');
        });
      } else {
        this.router.navigate('/', { replace: true, trigger: false});
        this.router.reset();
        this.router.deactivate();
        au.setRoot('app').then(() => {
          this.router.navigateToRoute('login');
        });
      }
    });
  }

  attached() {
    if (this.zwitscherService.isAuthenticated()) {
      this.au.setRoot('home').then(() => {
        this.router.navigateToRoute('globalTimeline');
      });
    }
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'login'], name: 'login', moduleId: 'viewmodels/login/login', nav: true, title: 'Login' },
      { route: 'signup', name: 'signup', moduleId: 'viewmodels/signup/signup', nav: true, title: 'Signup' }
    ]);

    config.mapUnknownRoutes(instruction => {
      return 'login';
    });

    this.router = router;
  }
}
