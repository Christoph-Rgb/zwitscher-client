import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'globalTimeline'], name: 'globalTimeline', moduleId: 'viewmodels/globalTimeline/globalTimeline', nav: true, title: 'Global Timeline' },
      { route: 'userTimeline/:id?', name: 'userTimeline', moduleId: 'viewmodels/userTimeline/userTimeline', nav: true, title: 'User Timeline', href: '#/userTimeline' },

      { route: 'users', name: 'users', moduleId: 'viewmodels/users/users', nav: true, title: 'Users' },
      { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' },
      { route: 'reload', name: 'reload', moduleId: 'viewmodels/reload/reload',  },
    ]);

    config.mapUnknownRoutes(instruction => {
      return 'globalTimeline';
    });

    this.router = router;
  }
}
