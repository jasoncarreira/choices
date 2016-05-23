import {autoinject} from "aurelia-framework";
import {UserService} from "./service/user-service";
import {User} from "./model/user";
import {DialogService} from "aurelia-dialog";
import {AccountDetails} from "./account-detail";
import {Account} from "./model/account";
import {Router} from "aurelia-router";

@autoinject
export class Profile {
  private accountId = 1;
  heading = 'User Profile';
  user:User;
  newUser:boolean;
  list:Account[] = [];

  constructor(private userService:UserService, private dialogService:DialogService, private router: Router) {
    this.userService = userService;
    this.dialogService = dialogService;
  }

  activate() {
    this.user = this.userService.loadUser().clone();
    this.newUser = (this.user.id == 0);
  }

  editAccount(account:Account, newAccount: boolean = false){
      let editableAccount = account.clone();
      this.dialogService.open({ viewModel: AccountDetails, model: editableAccount}).then(response => {
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
    this.editAccount(new Account(0,"","",0,0,0,0,0),true);
  }

  saveUser() {
    this.userService.saveUser(this.user);
    this.router.navigateToRoute("welcome");
  }
}
