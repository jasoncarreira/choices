import {autoinject, Container} from "aurelia-dependency-injection";
import {User} from "../model/user";
import {Logger} from "aurelia-logging";
import {LogManager} from "aurelia-framework";
import {Account} from "../model/account";
import {UserService} from "./user-service";

@autoinject()
export class LocalUserService extends UserService {
  user:User;
  container:Container;

  private static USER_KEY = 'yourchoices-user';
  private static LOG:Logger = LogManager.getLogger("LocalUserService");

  isLoggedIn():boolean {
    return this.loadUser() != undefined;
  }
  
  login(email:string, password:string) : User {
    let user = this.loadUser();
    if (user && user.emailAddress === email && user.password === password) {
      return user;
    } else {
      this.logout();
    }
    return null;
  }

  private loadUser():User {
    if (this.user != undefined) {
      return this.user;
    }
    let u = localStorage.getItem(LocalUserService.USER_KEY);
    LocalUserService.LOG.debug("LocalUserService.getUser(): Got from local storage: " + u);
    if (u != undefined) {
      let data = JSON.parse(u);
      let accounts = data.accounts.map(account => new Account(account.id, account.name, account.type, account.balance, account.contribution, account.cashPercentage, account.bondPercentage, account.stockPercentage));
      this.user = new User(data.id, data.email, data.password, data.firstName, data.lastName, data.age, data.retirementAge, data.salary, accounts);
    }
    return this.user;
  }

  getUser():User {
    let u = this.loadUser();
    if (u) {
      return u;
    } else {
      return new User(0, "", "", "", "", 0, 0, 0, []);
    }
  }

  saveUser(user:User):User {
    if (user.id == 0) {
      user.id = 1;
    }
    let data = JSON.stringify(user);
    LocalUserService.LOG.debug("LocalUserService.saveUser(): Writing to local storage: " + data);
    localStorage.setItem(LocalUserService.USER_KEY, data);
    this.user = user;
    return user;
  }

  logout() {
    this.user = null;
    localStorage.removeItem(LocalUserService.USER_KEY);
  }
}
