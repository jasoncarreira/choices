import {Router} from "aurelia-router";
import {bindable} from "aurelia-framework";
import {Settings} from "./model/settings";
import {inject} from "aurelia-dependency-injection";
import {autoinject} from "aurelia-dependency-injection";
import {InputService} from "./service/input-service";
import {UserService} from "./service/user-service";

@autoinject
export class NavBar {
  @bindable router:Router;
  settings:Settings;

  constructor(settings:Settings, private userService:UserService, private inputSevice:InputService) {
    this.settings = settings;
  }

  logout() {
    this.userService.logout();
    this.inputSevice.clearLatestInput();
    window.location.reload();
  }
}
