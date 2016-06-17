import {Router, RouterConfiguration} from 'aurelia-router';
import {Settings} from "./model/settings";
import {AuthorizeStep} from "./authentication-step";

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'YourChoices';
    config.addAuthorizeStep(AuthorizeStep);
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'welcome',      nav: true, title: 'Welcome', auth:true },
      { route: 'profile',         name: 'profile',        moduleId: 'profile',        nav: true, title: 'Profile' },
    ]);

    this.router = router;

  }
}
