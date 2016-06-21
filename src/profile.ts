import {UserService} from "./service/user-service";
import {User} from "./model/user";
import {DialogService} from "aurelia-dialog";
import {AccountDetails} from "./account-detail";
import {Account} from "./model/account";
import {Router} from "aurelia-router";
import {inject, NewInstance} from "aurelia-dependency-injection";
import {ValidationController} from "aurelia-validation";

@inject(UserService, DialogService, Router, NewInstance.of(ValidationController))
export class Profile {
  private accountId = 1;
  heading = 'User Profile';
  user:User;
  newUser:boolean;
  list:Account[] = [];
  formErrors;

  constructor(private userService:UserService, private dialogService:DialogService, private router:Router, private validationController:ValidationController) {
    validationController.validateTrigger = "change";
  }

  activate() {
    this.user = this.userService.getUser().clone();
    this.newUser = (this.user.id == 0);
  }

  editAccount(account:Account, newAccount:boolean = false) {
    let editableAccount = account.clone();
    this.dialogService.open({viewModel: AccountDetails, model: editableAccount}).then(response => {
      if (!response.wasCancelled) {
        Object.assign(account, editableAccount);
        if (newAccount) {
          account.id = this.accountId++;
          this.user.accounts.push(account);
        }
      }
      console.log(response.output);
    });
  }

  addAccount() {
    this.editAccount(new Account(0, "", "", 0, 0, 0, 0, 0), true);
  }

  saveUser() {
    let errors = this.validationController.validate();
    if (!errors) {
      this.userService.saveUser(this.user);
      this.router.navigateToRoute("welcome");
    }
  }
}
