import {autoinject} from "aurelia-framework";
import {UserService} from "./service/user-service";
import {User} from "./model/user";
import { MdToastService } from 'aurelia-materialize-bridge';
import {DialogService} from "aurelia-dialog";
import {AccountDetails} from "./account-detail";
import {Account} from "./model/account";
import {Router} from "aurelia-router";
import {Login} from "./login";

@autoinject
export class Profile {
  user:User;
  newUser:boolean;

  constructor(private userService:UserService, private toastService:MdToastService, private dialogService:DialogService, private router:Router) {
  }

  activate() {
    this.user = this.userService.getUser().clone();
    this.newUser = (!this.user.id);
  }

  editAccount(account:Account, newAccount:boolean = false) {
    let editableAccount = account.clone();
    this.dialogService.open({viewModel: AccountDetails, model: editableAccount}).then(response => {
      if (!response.wasCancelled) {
        Object.assign(account, editableAccount);
        if (newAccount) {
          this.user.accounts.push(account);
        }
      }
      console.log(response.output);
    });
  }

  addAccount() {
    this.editAccount(new Account("",this.user.id, "", "", 0, 0, 0, 0, 0), true);
  }

  saveUser() {
    this.userService.saveUser(this.user)
      .then(() => this.router.navigateToRoute("welcome"))
      .catch((error) => {
        console.log(error, "Could not save user!");
        this.toastService.show('Could not save user!', 4000);
      });
  }

  login() {
    this.dialogService.open({viewModel: Login})
      .then(response => {
        if (!response.wasCancelled) {
          response.output
            .then(()=> {
              this.toastService.show('Logged in!', 1000)
                  .then(() => this.router.navigateToRoute("welcome"));
              }
            )
            .catch(err=> {
              console.log("login failure : " + err);
              this.toastService.show('Could not log in!', 4000);
            });
        }
      });
  }
}
