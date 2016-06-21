import {DialogController} from "aurelia-dialog";
import {Account} from "./model/account";
import {inject,NewInstance} from "aurelia-dependency-injection";
import {ValidationController} from "aurelia-validation";

@inject(DialogController, NewInstance.of(ValidationController))
export class AccountDetails {
  account:Account;
  formErrors;

  constructor(private controller:DialogController,private validationController:ValidationController) {
    validationController.validateTrigger = "change";
  }

  activate(account:Account) {
    this.account = account;
  }

  ok() {
    let errors = this.validationController.validate();
    if (!errors) {
      this.controller.ok(this.account);
    }
  }

  cancel() {
    this.controller.cancel(this.account);
  }
}
