import {inject} from "aurelia-dependency-injection";
import {bindable} from "aurelia-framework";
import {SimulationResult} from "./model/simulation-result";
import * as numeral from "numeral";
import "novus/nvd3";
import "novus/nvd3/build/nv.d3.css!";
import PieChart = nv.PieChart;

@inject(Element)
export class ChartCustomElement {
  @bindable data:SimulationResult;
  private element:Element;


  constructor(element:Element) {
    this.element = element;
  }

  dataChanged(data:SimulationResult) {
    console.log('Chart dataChanged');
    let chartData = ChartCustomElement.buildData(data);
    nv.addGraph(function () {
      var chart:PieChart = nv.models.pieChart()
        .showLabels(true)     //Display pie labels
        .x((d) => {
          return d.label
        })
        .y((d) => {
          return d.value
        })
        .showLabels(true)
        // .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
        .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
        .labelsOutside(true)
        .width(550)
        .height(550)
        .title(numeral(data.neededTotalRetirementIncome).format('($0,0)'))
        .donutRatio(0.60)     //Configure how big you want the donut hole size to be.
        ;

      chart.tooltip.enabled(true);
      chart.tooltip.contentGenerator((d) => {
        return d.data.label + ' ' + numeral(d.data.value).format('($0,0)')
      });

      d3.select("#piechart")
        // .append("svg")
        .datum(chartData)
        .transition().duration(800)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });

  }

  static buildData(simulationResult:SimulationResult):Object[] {

    let totalRetirementIncome = simulationResult.availableRetirementIncome + simulationResult.socialSecurityIncome;
    let neededIncome = simulationResult.neededTotalRetirementIncome;
    let availableRetirementIncome = simulationResult.availableRetirementIncome;
    if (totalRetirementIncome > neededIncome) {
      totalRetirementIncome = neededIncome;
      availableRetirementIncome = Math.max(neededIncome - simulationResult.socialSecurityIncome, 0);
    }
    var data:Object[] = [
      {
        'label': 'Retirement Income',
        'value': availableRetirementIncome
      },
      {
        'label': 'Social Security',
        'value': simulationResult.socialSecurityIncome
      }
    ];
    if (neededIncome > totalRetirementIncome) {
      data.push(
        {
          'label': 'Income Gap',
          'value': neededIncome - totalRetirementIncome
        });
    }
    return data;
  }
}

