import {CalculationInput} from "./calc-input";
import {SimulationResult} from "./simulation-result";
export class CalculationOutput {
  input:CalculationInput;
  runDate:Date;
  simulationResult:SimulationResult;

  constructor(calculationInput:CalculationInput, simulationResult:SimulationResult) {
    this.input = calculationInput;
    this.simulationResult = simulationResult;
    this.runDate = new Date();
  }

  clone():CalculationOutput {
    var output = new CalculationOutput(this.input, this.simulationResult);
    output.runDate = this.runDate;
    return output;
  }


}
