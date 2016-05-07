import {User} from "./model/user";
import {CalculationInput} from "./model/calc-input";
import {Simulation} from "./service/simulation";
import {CalculationOutput} from "./model/calc-output";
import {Settings} from "./model/settings";
import {autoinject} from "aurelia-dependency-injection";
import {UserService} from "./service/user-service";
import {InputService} from "./service/input-service";

@autoinject()
export class Welcome {
  user:User;
  baseOutput:CalculationOutput;
  whatifOutput:CalculationOutput;
  retirementAge:number;
  retirementIncomePercentage:number;
  whatifInput:CalculationInput;
  settings;

  constructor(settings:Settings, private userService:UserService, private inputService:InputService) {
    this.settings = settings;
  }

  activate() {
    this.user = this.userService.loadUser().clone();
    let baseInput = new CalculationInput(this.user);
    this.baseOutput = Simulation.runCalculation(baseInput);
    this.setupWhatif();
  }

  private setupWhatif() {
    this.whatifInput = this.inputService.loadLatestInput(this.user);
    this.whatifOutput = Simulation.runCalculation(this.whatifInput);
    this.retirementAge = this.whatifInput.retirementAge;
    this.retirementIncomePercentage = this.whatifInput.retirementIncomePercentage * 100;
  }

  reset() {
    this.inputService.clearLatestInput();
    this.setupWhatif();
  }

  onRetirementAgeChange() {
    this.whatifInput.retirementAge = this.retirementAge;
    this.runSimulation();
  }

  onRetirementIncomePercentageChanged() {
    this.whatifInput.retirementIncomePercentage = this.retirementIncomePercentage / 100;
    this.runSimulation();
  }

  onContributionChanged() {
    this.runSimulation();
  }

  private runSimulation() {
    this.whatifOutput = Simulation.runCalculation(this.whatifInput);
    this.inputService.saveLatestInput(this.whatifInput);
  }
}
