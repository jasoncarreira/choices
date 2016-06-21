import {Account} from "./account";
import {required,email,numericality} from "aurelia-validatejs";
export class User {
  id:number;
  @required
  firstName:string;
  @required
  lastName:string;
  @required
  @numericality
  age:number;
  @required
  retirementAge:number;
  @required
  salary:number;
  @required
  accounts:Account[];
  @email
  @required
  emailAddress:string;
  @required
  password:string;

  constructor(id:number, email: string, password: string, firstName:string, lastName:string, age:number, retirementAge:number, salary:number, accounts:Account[]) {
    this.id = id;
    this.emailAddress = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.retirementAge = retirementAge;
    this.salary = salary;
    this.accounts = accounts;
  }

  clone(): User {
    return new User(this.id,this.emailAddress, this.password, this.firstName,this.lastName,this.age,this.retirementAge,this.salary,this.accounts.map(account => account.clone()));
  }
}
