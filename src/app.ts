import {Router, RouterConfiguration} from 'aurelia-router';
import {autoinject} from "aurelia-dependency-injection";
import {UserService} from "./service/user-service";

@autoinject()
export class App {
  router: Router;

  constructor(private userService: UserService){}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'YourChoices';
    config.addAuthorizeStep(this.userService.getAuthorizeStep());
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'welcome',      nav: true, title: 'Welcome', auth:true },
      { route: 'profile',         name: 'profile',        moduleId: 'profile',        nav: true, title: 'Profile' },
    ]);

    this.router = router;

  }
}
