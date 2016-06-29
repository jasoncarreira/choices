import {autoinject, Container} from "aurelia-dependency-injection";
import {User} from "../model/user";
import {Logger} from "aurelia-logging";
import {LogManager} from "aurelia-framework";
import {Account} from "../model/account";
import {UserService} from "./user-service";
import {Redirect} from "aurelia-router";

@autoinject()
export class LocalUserService extends UserService {

  private static USER_KEY = 'yourchoices-user';
  private static LOG:Logger = LogManager.getLogger("LocalUserService");

  login(email:string, password:string):Promise<any> {
    return new Promise((resolve, reject) => {
        let user = this.loadUser();
        if (user && user.email === email && user.password === password) {
          resolve(user);
        } else {
          this.logout();
          reject();
        }
      }
    );
  }

  private loadUser():User {
    if (this.user != undefined) {
      return this.user;
    }
    let u = localStorage.getItem(LocalUserService.USER_KEY);
    LocalUserService.LOG.debug("LocalUserService.getUser(): Got from local storage: " + u);
    this.user = this.parseUser(u);
    return this.user;
  }

  getUser():User {
    let u = this.loadUser();
    if (u) {
      return u;
    } else {
      return new User(null, "", "", "", "", 0, 0, 0, []);
    }
  }

  saveUser(user:User):Promise<any> {
    return new Promise((resolve, reject) => {
      if (!user.id) {
        user.id = user.email;
      }
      let data = JSON.stringify(user);
      LocalUserService.LOG.debug("LocalUserService.saveUser(): Writing to local storage: " + data);
      localStorage.setItem(LocalUserService.USER_KEY, data);
      this.user = user;
      resolve();
    });
  }

  logout() {
    this.user = null;
    localStorage.removeItem(LocalUserService.USER_KEY);
  }
  
  getAuthorizeStep() {
    return AuthorizeStep;
  }
}

export class Authentication {
  initialUrl:string;

}

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
