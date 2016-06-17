import {Account} from "./account";
import {User} from "./user";
export class CalculationInput {
  user:User;
  retirementIncomePercentage:number;
  retirementAge:number;
  accounts:Account[];

  constructor(user:User, retirementIncomePercentage:number = 0.80) {
    this.user = user;
    this.retirementAge = user.retirementAge;
    this.retirementIncomePercentage = retirementIncomePercentage;
    this.accounts = user.accounts.map(account => account.clone());
  }
}
