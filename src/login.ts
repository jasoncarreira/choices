import {autoinject} from "aurelia-framework";
import {UserService} from "./service/user-service";
import {Router} from "aurelia-router";
import {DialogController} from "aurelia-dialog";

@autoinject
export class Login {
  email:string;
  password:string;

  constructor(private userService:UserService, private router:Router, private controller:DialogController) {
  }
  
  doLogin() {
    if (this.email && this.password) {
      this.controller.ok(this.userService.login(this.email, this.password));
    }
  }

  cancel() {
    this.controller.cancel();
  }
}
