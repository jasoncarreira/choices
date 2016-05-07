export class SimulationResult {
  retirementBalances:number[];
  totalRetirementBalance:number;
  chanceOfSuccess:number;
  availableRetirementIncome:number;
  socialSecurityIncome:number;
  incomeRequiredFromAccounts:number;
  neededTotalRetirementIncome:number;
  gapOrSurplus;

  constructor(retirementBalances:number[], neededTotalRetirementIncome:number, incomeRequiredFromAccounts:number, availablRetirementIncome:number, socialSecurityIncome:number, chanceOfSuccess:number) {
    this.retirementBalances = retirementBalances;
    this.neededTotalRetirementIncome = neededTotalRetirementIncome;
    this.incomeRequiredFromAccounts = incomeRequiredFromAccounts;
    this.availableRetirementIncome = availablRetirementIncome;
    this.socialSecurityIncome = socialSecurityIncome;
    this.gapOrSurplus = availablRetirementIncome + socialSecurityIncome - neededTotalRetirementIncome;
    this.chanceOfSuccess = chanceOfSuccess;
    this.totalRetirementBalance = retirementBalances.reduce((total, current) => {
      return total + current;
    }, 0);
  }
}
