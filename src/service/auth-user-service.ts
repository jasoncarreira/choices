import {User} from "../model/user";
import {UserService} from "./user-service";
import {AuthService, FetchConfig, AuthorizeStep} from 'aurelia-auth';
import {autoinject} from "aurelia-dependency-injection";
@autoinject()
export class AuthUserService extends UserService {
  constructor(private fetchConfig:FetchConfig, private auth: AuthService) {
    super();
    fetchConfig.configure();
  }

  login(email:string, password:string) : Promise<any> {
    return this.auth.login(email, password)
      .then(response=>{
        console.log("success logged ",response);
        if (response.user) {
          this.user = this.parseUser(response.user);
        }
      })
  }
  logout() {
    this.user = null;
    this.auth.logout("#/profile");
  }
  getUser():User {
    if (this.user) {
      return this.user;
    } else {
      return new User(null, "", "", "", "", 0, 0, 0, []);
    }
  }
  saveUser(user:User):Promise<any> {
    return this.auth.signup(user,null,null)
      .then(() => this.user = this.auth.getMe());
  }


  getAuthorizeStep():Function {
    return AuthorizeStep;
  }
}
