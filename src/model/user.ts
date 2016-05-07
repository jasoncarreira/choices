import {Account} from "./account";
export class User {
  id:number;
  firstName:string;
  lastName:string;
  age:number;
  retirementAge:number;
  salary:number;
  accounts:Account[];

  constructor(id:number, firstName:string, lastName:string, age:number, retirementAge:number, salary:number, accounts:Account[]) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.retirementAge = retirementAge;
    this.salary = salary;
    this.accounts = accounts;
  }

  clone(): User {
    return new User(this.id,this.firstName,this.lastName,this.age,this.retirementAge,this.salary,this.accounts.map(account => account.clone()));
  }
}
