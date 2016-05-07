import {autoinject, Container} from "aurelia-dependency-injection";
import {Logger} from "aurelia-logging";
import {LogManager} from "aurelia-framework";
import {CalculationInput} from "../model/calc-input";
import {User} from "../model/user";
import {Account} from "../model/account";

@autoinject()
export class InputService {
  latestInput:CalculationInput;
  container:Container;

  private static INPUT_KEY = 'yourchoices-input';
  private static LOG:Logger = LogManager.getLogger("InputService");

  hasLatest(user:User):boolean {
    return this.getLatestInput(user) != undefined;
  }

  private getLatestInput(user:User):CalculationInput {
    if (this.latestInput != undefined) {
      return this.latestInput;
    }
    let input = localStorage.getItem(InputService.INPUT_KEY);
    InputService.LOG.debug("InputService.getLatestInput(): Got from local storage: " + input);
    if (input != undefined) {
      let data = JSON.parse(input);
      this.latestInput = new CalculationInput(user);
      this.latestInput.retirementAge = data.retirementAge;
      this.latestInput.retirementIncomePercentage = data.retirementIncomePercentage;
      let accountContributions = data.accountContributions;
      this.latestInput.accounts.forEach((account:Account) => {
        let contribution = accountContributions[account.id];
        if (contribution) {
          account.contribution = parseInt(contribution);
        }
      });
    }
    return this.latestInput;
  }

  loadLatestInput(user:User):CalculationInput {
    let u = this.getLatestInput(user);
    if (u) {
      return u;
    } else {
      return new CalculationInput(user);
    }
  }

  saveLatestInput(input:CalculationInput):CalculationInput {
    let accountContributions = input.accounts.reduce((val, account:Account) => {
      val[account.id] = account.contribution;
      return val;
    }, {});
    let data = {
      userId: input.user.id,
      retirementAge: input.retirementAge,
      retirementIncomePercentage: input.retirementIncomePercentage,
      accountContributions: accountContributions
    };
    let s = JSON.stringify(data);
    InputService.LOG.debug("InputService.saveLatestInput(): Writing to local storage: " + s);

    localStorage.setItem(InputService.INPUT_KEY, s);
    this.latestInput = input;
    return input;
  }

  clearLatestInput() {
    this.latestInput = null;
    localStorage.removeItem(InputService.INPUT_KEY);
  }
}
