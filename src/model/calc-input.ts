import {Account} from "./account";
import {User} from "./user";
export class CalculationInput {
  user:User;
  retirementIncomePercentage;
  retirementAge:number;
  accounts:Account[];

  constructor(user:User, retirementIncomePercentage:number = 0.80) {
    retirementIncomePercentage = retirementIncomePercentage || retirementIncomePercentage;
    this.user = user;
    this.retirementAge = user.retirementAge;
    this.retirementIncomePercentage = retirementIncomePercentage;
    this.accounts = user.accounts.map(account => account.clone());
  }
}
