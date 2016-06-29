import {Account} from "./account";
export class User {
  id:string;
  firstName:string;
  lastName:string;
  age:number;
  retirementAge:number;
  salary:number;
  accounts:Account[];
  email:string;
  password:string;

  constructor(id:string, email: string, password: string, firstName:string, lastName:string, age:number, retirementAge:number, salary:number, accounts:Account[]) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.retirementAge = retirementAge;
    this.salary = salary;
    this.accounts = accounts;
  }

  clone(): User {
    return new User(this.id,this.email, this.password, this.firstName,this.lastName,this.age,this.retirementAge,this.salary,this.accounts.map(account => account.clone()));
  }
}
