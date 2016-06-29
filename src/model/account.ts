export class Account {
  public static TYPE_401K = '401k';
  public static TYPE_HSA = 'HSA';

  id:string;
  ownerId: string;
  name:string;
  type:string;
  balance:number;
  contribution:number;
  cashPercentage:number;
  bondPercentage:number;
  stockPercentage:number;
  retirementBalance:number;

  constructor(id:string, ownerId:string, name:string, type:string, balance:number, contribution:number, cashPercentage:number, bondPercentage:number, stockPercentage:number) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.type = type;
    this.balance = balance;
    this.contribution = contribution;
    this.cashPercentage = cashPercentage;
    this.bondPercentage = bondPercentage;
    this.stockPercentage = stockPercentage;
  }

  clone():Account {
    let this2 = new Account(this.id, this.ownerId, this.name, this.type, this.balance, this.contribution, this.cashPercentage, this.bondPercentage, this.stockPercentage);
    this2.retirementBalance = this.retirementBalance;
    return this2;
  }
}
