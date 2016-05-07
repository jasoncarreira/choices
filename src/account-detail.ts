import {DialogController} from "aurelia-dialog";
import {autoinject} from "aurelia-dependency-injection";
import {Account} from "./model/account";

@autoinject
export class AccountDetails {
  controller:DialogController;
  account:Account;
  
  constructor(controller:DialogController) {
     this.controller = controller;
   }

  activate(account:Account) {
    this.account = account;
  }

  ok() {
    this.controller.ok(this.account);
  }

  cancel() {
    this.controller.cancel(this.account);
  }
}
