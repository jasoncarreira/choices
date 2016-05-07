import {autoinject, Container} from "aurelia-dependency-injection";
import {User} from "../model/user";
import {Logger} from "aurelia-logging";
import {LogManager} from "aurelia-framework";
import {Account} from "../model/account";

@autoinject()
export class UserService {
  user:User;
  container:Container;

  private static USER_KEY = 'yourchoices-user';
  private static LOG:Logger = LogManager.getLogger("UserService");

  isLoggedIn():boolean {
    return this.getUser() != undefined;
  }

  private getUser():User {
    if (this.user != undefined) {
      return this.user;
    }
    let u = localStorage.getItem(UserService.USER_KEY);
    UserService.LOG.debug("UserService.loadUser(): Got from local storage: " + u);
    if (u != undefined) {
      let data = JSON.parse(u);
      let accounts = data.accounts.map(account => new Account(account.id, account.name, account.type, account.balance, account.contribution, account.cashPercentage, account.bondPercentage, account.stockPercentage));
      this.user = new User(data.id, data.firstName, data.lastName, data.age, data.retirementAge, data.salary, accounts);
    }
    return this.user;
  }

  loadUser():User {
    let u = this.getUser();
    if (u) {
      return u;
    } else {
      return new User(0, "", "", 0, 0, 0, []);
    }
  }

  saveUser(user:User):User {
    if (user.id == 0) {
      user.id = 1;
    }
    let data = JSON.stringify(user);
    UserService.LOG.debug("UserService.saveUser(): Writing to local storage: " + data);
    localStorage.setItem(UserService.USER_KEY, data);
    this.user = user;
    return user;
  }

  logout() {
    this.user = null;
    localStorage.removeItem(UserService.USER_KEY);
  }
}
