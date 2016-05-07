import {LogManager} from "aurelia-framework";
import {Logger} from "aurelia-logging";
import {CalculationInput} from "../model/calc-input";
import {CalculationOutput} from "../model/calc-output";
import {Account} from "../model/account";
import {User} from "../model/user";
import {SimulationResult} from "../model/simulation-result";


export class Simulation {
  public static STOCK_RETURN:number = 0.10;
  public static BOND_RETURN:number = 0.027;
  public static CASH_RETURN:number = 0.01;
  public static INTEREST:number = 0.025;
  public static STOCK_STANDARD_DEV = 0.20;
  public static BOND_STANDARD_DEV = 0.005;

  private static LOG:Logger = LogManager.getLogger("Simulation");

  // main entry point to run calculation
  static runCalculation(input:CalculationInput):CalculationOutput {
    Simulation.LOG.debug("Simulation:runCalculation(" + input + ")");

    let simulationResult:SimulationResult = Simulation.simulateChanceOfSuccess(input);
    return new CalculationOutput(input, simulationResult);
  }

  // build retirement balances of accounts
  private static buildRetirementBalances(input:CalculationInput, stockReturnRate:number = Simulation.STOCK_RETURN, bondReturnRate:number = Simulation.BOND_RETURN, cashReturnRate:number = Simulation.CASH_RETURN):number[] {
    return input.accounts.map(account => Simulation.retirementBalance(account, input.retirementAge - input.user.age, stockReturnRate, bondReturnRate, cashReturnRate));
  }

  // get the total balance of all accounts at retirement
  private static getTotalRetirementBalance(input:CalculationInput, stockReturnRate:number = Simulation.STOCK_RETURN, bondReturnRate:number = Simulation.BOND_RETURN, cashReturnRate:number = Simulation.CASH_RETURN):number {
    return Simulation.buildRetirementBalances(input, stockReturnRate, bondReturnRate, cashReturnRate).reduce((total, current) => {
      return total + current;
    }, 0);
  }

  // get the balance at retirement of one account
  static retirementBalance(account:Account, yearsToRetirement:number, stockReturnRate:number = Simulation.STOCK_RETURN, bondReturnRate:number = Simulation.BOND_RETURN, cashReturnRate:number = Simulation.CASH_RETURN):number {
    let stockPercentage = account.stockPercentage / 100;
    let bondPercentage = account.bondPercentage / 100;
    let cashPercentage = account.cashPercentage / 100;
    let stockBalance = account.balance * stockPercentage;
    let bondBalance = account.balance * bondPercentage;
    let cashBalance = account.balance * cashPercentage;
    return Simulation.presentValue(Simulation.futureValueWithContribution(stockBalance, yearsToRetirement, stockReturnRate, account.contribution * stockPercentage), yearsToRetirement, Simulation.INTEREST)
      + Simulation.presentValue(Simulation.futureValueWithContribution(bondBalance, yearsToRetirement, bondReturnRate, account.contribution * bondPercentage), yearsToRetirement, Simulation.INTEREST)
      + Simulation.presentValue(Simulation.futureValueWithContribution(cashBalance, yearsToRetirement, cashReturnRate, account.contribution * cashPercentage), yearsToRetirement, Simulation.INTEREST);

  }

  // calculate the future value of an account with a current balance and monthly contribution
  static futureValueWithContribution(balance:number, years:number, returnRate:number, contributionAnnual:number):number {
    let monthlyReturn = returnRate / 12;
    let monthlyContribution = contributionAnnual / 12;
    let months = years * 12;
    let growthFactor = Math.pow(1 + monthlyReturn, months);
    let futureValueOfPrinciple = balance * growthFactor;
    let futureValueOfContributions = monthlyContribution / monthlyReturn * (growthFactor - 1);
    return futureValueOfPrinciple + futureValueOfContributions;
  }

  // calculate the present value of a future dollar value
  static presentValue(futureValue:number, years:number, interestRate:number) {
    return futureValue * Math.pow(1 + interestRate, -1 * years);
  }

  // calculate the chance of success and key values that lead to that value
  static simulateChanceOfSuccess(input:CalculationInput):SimulationResult {
    Simulation.LOG.debug("Simulation:chanceOfSuccess(" + input + ")");
    let retirementBalances:number[] = Simulation.buildRetirementBalances(input);
    let socialSecurityAnnual = Simulation.esimatedSocialSecurityAnnual(input.user, input.retirementAge);
    let neededTotalRetirementIncome:number = input.user.salary * input.retirementIncomePercentage; 
    let incomeRequiredFromAccounts:number = neededTotalRetirementIncome - socialSecurityAnnual;
    let requiredRetirementBalance:number = incomeRequiredFromAccounts / 0.04; // 4% withdrawal rate
    let baseRetirementBalance = Simulation.getTotalRetirementBalance(input);
    let availableRetirementIncome = baseRetirementBalance * 0.04;
    let yearsTillRetirement = input.retirementAge - input.user.age;
    let standardDeviationRetirementBalance = Math.max(
      Simulation.getTotalRetirementBalance(input, Simulation.STOCK_RETURN + Math.max(0.02, Simulation.STOCK_STANDARD_DEV / yearsTillRetirement)),
      Simulation.getTotalRetirementBalance(input, Simulation.STOCK_RETURN, Simulation.BOND_RETURN + Math.max(.001, Simulation.BOND_STANDARD_DEV / yearsTillRetirement))
    );
    Simulation.LOG.debug("Simulation:chanceOfSuccess: incomeRequiredFromAccounts = " + incomeRequiredFromAccounts + ", requiredRetirementBalance = "
      + requiredRetirementBalance + ", baseRetirementBalance = " + baseRetirementBalance + ", yearsTillRetirement = " + yearsTillRetirement + ", standardDeviationRetirementBalance = " + standardDeviationRetirementBalance);
    let chanceOfSuccess = Simulation.normalizedNormalDistributionProbabilityDensity(requiredRetirementBalance, baseRetirementBalance, standardDeviationRetirementBalance - baseRetirementBalance);
    Simulation.LOG.debug("Simulation:chanceOfSuccess: returning -> retirementBalances = " + retirementBalances + ", availableRetirementIncome = "
      + availableRetirementIncome + ", socialSecurityIncome = " + socialSecurityAnnual + ", chanceOfSuccess = " + chanceOfSuccess);
    return new SimulationResult(retirementBalances, neededTotalRetirementIncome, incomeRequiredFromAccounts, availableRetirementIncome, socialSecurityAnnual, chanceOfSuccess);
  }

  // calculate the probability density of a normalized distribution
  // 1/2(1 + erf((x-mu)/(sigma * sqrt(2))
  static normalizedNormalDistributionProbabilityDensity(x:number, mean:number, standardDeviation:number) {
    let errorPortion = Simulation.erf((x - mean) / (standardDeviation * Math.SQRT2));
    return 1 - (1 / 2 * (1 + errorPortion));
  }

  // error function for normal distribution calculation
  private static erf(x):number {
    // erf(x) = 2/sqrt(pi) * integrate(from=0, to=x, e^-(t^2) ) dt
    // with using Taylor expansion,
    //        = 2/sqrt(pi) * sigma(n=0 to +inf, ((-1)^n * x^(2n+1))/(n! * (2n+1)))
    // calculationg n=0 to 50 bellow (note that inside sigma equals x when n = 0, and 50 may be enough)
    var m = 1.00;
    var s = 1.00;
    var sum = x * 1.0;
    for (var i = 1; i < 50; i++) {
      m *= i;
      s *= -1;
      sum += (s * Math.pow(x, 2.0 * i + 1.0)) / (m * (2.0 * i + 1.0));
    }
    return 2 * sum / Math.sqrt(3.14159265358979);
  }

  // estimate the annual social security income
  static esimatedSocialSecurityAnnual(user:User, retirementAge) {
    let fullRetirementAge = (user.age < 56) ? 67 : 66;
    retirementAge = Math.min(retirementAge, 70);
    retirementAge = Math.max(retirementAge, 62);
    let benefitMultiplier = 1.0;
    if (retirementAge > fullRetirementAge) {
      benefitMultiplier = 1 + 0.08 * (retirementAge - fullRetirementAge);
    } else if (retirementAge < fullRetirementAge) {
      let earlyRetirementYears = fullRetirementAge - retirementAge;
      if (earlyRetirementYears > 3) {
        benefitMultiplier = 1 - (5 / 9 * 0.01 * 36) - (5 / 12 * 0.01 * (earlyRetirementYears - 3) * 12);
      } else {
        benefitMultiplier = 1 - (5 / 9 * 0.01 * earlyRetirementYears * 12);
      }
    }
    let hsaContribution = user.accounts.reduce((total, acccount) => {
      return (acccount.type == Account.TYPE_HSA) ? acccount.contribution : 0;
    }, 0);
    let countedSalary = user.salary - hsaContribution;
    let monthlyCountedSalary = countedSalary / 12;
    let tierTwoBenefit = 0;
    let tierThreeBenefit = 0;
    let tierOneBenefit = Math.min(monthlyCountedSalary, 856) * 0.9;
    if (monthlyCountedSalary > 856) {
      tierTwoBenefit = (Math.min(monthlyCountedSalary, 5157) - 856) * .32;
    }
    if (monthlyCountedSalary > 5157) {
      tierThreeBenefit = (monthlyCountedSalary - 5157) * .15;
    }
    let totalBaseBenefit = Math.min(tierOneBenefit + tierTwoBenefit + tierThreeBenefit, 2639);
    return totalBaseBenefit * benefitMultiplier * 12;
  }
}
