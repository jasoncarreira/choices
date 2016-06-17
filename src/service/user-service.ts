import {User} from "../model/user";
export abstract class UserService {
  abstract isLoggedIn():boolean;
  abstract login(email:string, password:string) : User;
  abstract logout();
  abstract getUser():User;
  abstract saveUser(user:User):User;
}
