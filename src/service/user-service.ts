import {User} from "../model/user";
import {Account} from "../model/account";
export abstract class UserService {
  user:User;
  
  isLoggedIn():boolean {
    return this.user != undefined;
  }
  abstract login(email:string, password:string) : Promise<any>;
  abstract logout();
  abstract getUser():User;
  abstract saveUser(user:User):Promise<any>;
  abstract getAuthorizeStep():Function;

  parseUser(jsonString:string) {
    let user;
    if (jsonString) {
      console.log("parsing",jsonString);
      let data = (typeof jsonString === "string") ? JSON.parse(jsonString) : jsonString;
      let accounts = data.accounts.map(account => new Account(account.id, account.ownerId, account.name, account.type, account.balance, account.contribution, account.cashPercentage, account.bondPercentage, account.stockPercentage));
      user = new User(data.id, data.email, data.password, data.firstName, data.lastName, data.age, data.retirementAge, data.salary, accounts);
    }
    return user;
  }
}
