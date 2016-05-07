import {bindable, bindingMode} from "aurelia-framework";
import {inject} from "aurelia-dependency-injection";

@inject(Element)
export class SliderValueCustomElement {
  @bindable({defaultBindingMode: bindingMode.twoWay}) propertyName:string;
  @bindable label:string;
  @bindable min:number;
  @bindable max:number;
  @bindable step:number;
  element:Element;


  constructor(element:Element) {
    this.element = element;
  }


  onPropertyChange(event) {
    let e = new CustomEvent('change', {
      detail: {
        value: event.val
      },
      bubbles: true
    });
    this.element.dispatchEvent(e);
  }
}
