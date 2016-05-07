import {Simulation} from "src/service/simulation";
import {Account} from "../../src/model/account";
import {User} from "../../src/model/user";
import {CalculationInput} from "../../src/model/calc-input";
import {SimulationResult} from "../../src/model/simulation-result";
describe('The future value ', () => {
  let fv = Simulation.futureValueWithContribution(1000, 10, .1, 1200);
  it('is not null', () => {
    expect(fv).not.toBeNull();
  });
  it('should be greater than the current value', () => {
    expect(fv).toBeGreaterThan(1000);
  });
  it('should be the expected future value', () => {
    expect(fv).toBeCloseTo(23191.54, 2);
  });
});

describe('The present value of a future amount ', () => {
  let pv = Simulation.presentValue(20000, 10, .025);
  it('is not null', () => {
    expect(pv).not.toBeNull();
  });
  it('should be less than the future value', () => {
    expect(pv).toBeLessThan(20000);
  });
  it('should be the expected present value', () => {
    expect(pv).toBeCloseTo(15623.97, 2);
  });
});

describe('The retirement balance of an account', () => {
  it('should be the present value of the future value with the stock return rate when 100% stock', () => {
    let stockAccount = new Account(1, 'Stock account', '401k', 10000, 1200, 0, 0, 100);
    let futureValueWithContribution = Simulation.futureValueWithContribution(stockAccount.balance, 10, Simulation.STOCK_RETURN, stockAccount.contribution);
    let presentValue = Simulation.presentValue(futureValueWithContribution, 10, Simulation.INTEREST);
    let retirementBalance = Simulation.retirementBalance(stockAccount, 10);
    expect(retirementBalance).toBeCloseTo(presentValue, 2);
  });
  it('should be greater than present value of the future value with the stock return rate when 100% stock when using a higher stock return rate', () => {
    let stockAccount = new Account(1, 'Stock account', '401k', 10000, 1200, 0, 0, 100);
    let futureValueWithContribution = Simulation.futureValueWithContribution(stockAccount.balance, 10, Simulation.STOCK_RETURN, stockAccount.contribution);
    let presentValue = Simulation.presentValue(futureValueWithContribution, 10, Simulation.INTEREST);
    let retirementBalance = Simulation.retirementBalance(stockAccount, 10, Simulation.STOCK_RETURN + Simulation.STOCK_STANDARD_DEV);
    expect(retirementBalance).toBeGreaterThan(presentValue);
  });
  it('should be the present value of the future value with the bond return rate when 100% bonds', () => {
    let bondAccount = new Account(1, 'Bond account', '401k', 10000, 1200, 0, 100, 0);
    let futureValueWithContribution = Simulation.futureValueWithContribution(bondAccount.balance, 10, Simulation.BOND_RETURN, bondAccount.contribution);
    let presentValue = Simulation.presentValue(futureValueWithContribution, 10, Simulation.INTEREST);
    let retirementBalance = Simulation.retirementBalance(bondAccount, 10);
    expect(retirementBalance).toBeCloseTo(presentValue, 2);
  });
  it('should be the present value of the future value with the cash return rate when 100% cash', () => {
    let cashAccount = new Account(1, 'Cash account', '401k', 10000, 1200, 100, 0, 0);
    let futureValueWithContribution = Simulation.futureValueWithContribution(cashAccount.balance, 10, Simulation.CASH_RETURN, cashAccount.contribution);
    let presentValue = Simulation.presentValue(futureValueWithContribution, 10, Simulation.INTEREST);
    let retirementBalance = Simulation.retirementBalance(cashAccount, 10);
    expect(retirementBalance).toBeCloseTo(presentValue, 2);
  });

  it('should be the present value of the future value of each of the asset type return rates', () => {
    let mixedAccount = new Account(1, 'Mixed account', '401k', 10000, 1200, 25, 25, 50);
    let stockPercentage = mixedAccount.stockPercentage / 100;
    let bondPecentage = mixedAccount.bondPercentage / 100;
    let cashPercentage = mixedAccount.cashPercentage / 100;
    let stockBalance = mixedAccount.balance * stockPercentage;
    let bondBalance = mixedAccount.balance * bondPecentage;
    let cashBalance = mixedAccount.balance * cashPercentage;
    let stockRetirementBalance = Simulation.presentValue(Simulation.futureValueWithContribution(stockBalance, 10, Simulation.STOCK_RETURN, mixedAccount.contribution * stockPercentage), 10, Simulation.INTEREST);
    let bondRetirementBalance = Simulation.presentValue(Simulation.futureValueWithContribution(bondBalance, 10, Simulation.BOND_RETURN, mixedAccount.contribution * bondPecentage), 10, Simulation.INTEREST);
    let cashRetirementBalance = Simulation.presentValue(Simulation.futureValueWithContribution(cashBalance, 10, Simulation.CASH_RETURN, mixedAccount.contribution * cashPercentage), 10, Simulation.INTEREST);
    let retirementBalance = Simulation.retirementBalance(mixedAccount, 10);
    let expectedRetirementBalance = stockRetirementBalance + bondRetirementBalance + cashRetirementBalance;
    expect(retirementBalance).toBeCloseTo(expectedRetirementBalance, 2);
  });

  it('should be the sum of the retirement balances of the accounts for the calculation output', () => {
    let retirementAccount = new Account(1, 'Retirement account', '401k', 10000, 1200, 25, 25, 50);
    let hsaAccount = new Account(2, 'HSA account', 'HSA', 1000, 500, 75, 25, 0);

    let retirementAccountRetirementBalance = Simulation.retirementBalance(retirementAccount, 10);
    let hsaAccountRetirementBalance = Simulation.retirementBalance(hsaAccount, 10);

    let user:User = new User(1, "John", "Doe", 58, 68, 50000, [retirementAccount, hsaAccount]);
    let calculationOutput = Simulation.runCalculation(new CalculationInput(user));
    expect(calculationOutput.simulationResult.totalRetirementBalance).toBe(retirementAccountRetirementBalance + hsaAccountRetirementBalance);
  })
});

describe('The normalized normal distribution probability density  ', () => {
  let probability = Simulation.normalizedNormalDistributionProbabilityDensity(10, 10, 2);
  it('is not null or undefined', () => {
    expect(probability).not.toBeNull();
    expect(probability).not.toBeUndefined();
  });
  it('should be 0.5 for the mean', () => {
    expect(probability).toBe(0.5);
  });
});

describe('The chance of success', () => {
  let stockAccount = new Account(1, 'Stock account', '401k', 250000, 8000, 0, 0, 100);
  let retirementBalance = Simulation.retirementBalance(stockAccount, 10);
  let availableRetirementIncome = 0.04 * retirementBalance;
  let currentSalary = (availableRetirementIncome + 21387)/ 0.80; // social security
  let user = new User(1, "First", "Last", 55, 65, currentSalary, [stockAccount]);
  let input = new CalculationInput(user, 0.80);
  let simulationResult:SimulationResult = Simulation.simulateChanceOfSuccess(input);
  it('should not be null or undefined', () => {
    expect(simulationResult).not.toBeNull();
    expect(simulationResult).not.toBeUndefined();
  });

  it('should be 0.5 for the mean', () => {
    expect(simulationResult.chanceOfSuccess).toBeCloseTo(0.5,2);
  });
  let input2 = new CalculationInput(user, 0.90);
  let simulationResult2 = Simulation.simulateChanceOfSuccess(input2);

  it('should be less than 0.5 for a higher required income', () => {
    expect(simulationResult2.chanceOfSuccess).toBeLessThan(0.5);
  });
  let input3 = new CalculationInput(user, 0.70);
  let simulationResult3 = Simulation.simulateChanceOfSuccess(input3);

  it('should be more than 0.5 for a lower required income', () => {
    expect(simulationResult3.chanceOfSuccess).toBeGreaterThan(0.5);
  });
});

describe('The estimated social security ', () => {
  let user:User = new User(1, "First", "Last", 56, 66, 40000, []);
  let esimatedSocialSecurityAnnual = Simulation.esimatedSocialSecurityAnnual(user, 66);
  it('is not null or undefined', () => {
    expect(esimatedSocialSecurityAnnual).not.toBeNull();
    expect(esimatedSocialSecurityAnnual).not.toBeUndefined();
  });

  it('should be the same as doing it by hand ', () => {
    expect(esimatedSocialSecurityAnnual).toBeCloseTo(18757.76, 2);
  });

  it('should be 8% higher retiring a year later ', () => {
    expect(Simulation.esimatedSocialSecurityAnnual(user, 67)).toBeCloseTo(esimatedSocialSecurityAnnual * 1.08, 2);
  });

  it('should be 16% higher retiring 2 years later ', () => {
    expect(Simulation.esimatedSocialSecurityAnnual(user, 68)).toBeCloseTo(esimatedSocialSecurityAnnual * 1.16, 2);
  });

  it('should be 24% higher retiring 3 years later ', () => {
    expect(Simulation.esimatedSocialSecurityAnnual(user, 69)).toBeCloseTo(esimatedSocialSecurityAnnual * 1.24, 2);
  });

  it('should be 25% lower retiring at 62 ', () => {
    expect(Simulation.esimatedSocialSecurityAnnual(user, 62)).toBeCloseTo(esimatedSocialSecurityAnnual * .75, 2);
  });

  it('should be 20% lower retiring 3 years early ', () => {
    expect(Simulation.esimatedSocialSecurityAnnual(user, 63)).toBeCloseTo(esimatedSocialSecurityAnnual * .8, 2);
  });
});


