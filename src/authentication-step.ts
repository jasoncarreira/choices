import {Authentication} from "./authentication";
import {Redirect} from "aurelia-router";
import {autoinject} from "aurelia-dependency-injection";
import {UserService} from "./service/user-service";

@autoinject()
export class AuthorizeStep {
  constructor(private auth:Authentication, private userService:UserService) {
  }

  run(routingContext, next) {
    let isLoggedIn = this.userService.isLoggedIn();
    let loginRoute = 'profile';

    if (routingContext.getAllInstructions().some(i => i.config.auth)) {
      if (!isLoggedIn) {
        this.auth.initialUrl = window.location.href;
        return next.cancel(new Redirect(loginRoute));
      }
    }

    return next();
  }
}
