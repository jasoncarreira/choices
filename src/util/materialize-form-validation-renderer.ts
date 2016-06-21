import {inject} from 'aurelia-dependency-injection';
import {validationRenderer} from 'aurelia-validation';

@validationRenderer
@inject(Element)
export class MaterializeFormValidationRenderer {
  private boundaryElement;
  constructor(boundaryElement) {
    this.boundaryElement = boundaryElement;
  }

  render(error, target) {
    if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
      return;
    }

    // tag the element so we know we rendered into it.
    target.errors = (target.errors || new Map());
    target.errors.set(error);
    target.querySelector("input").classList.add('invalid');

  }

  unrender(error, target) {
    if (!target || !target.errors || !target.errors.has(error)) {
      return;
    }
    target.errors.delete(error);

    // remove the invalid class on the field
    target.querySelector("input").classList.remove('invalid');
  }
}

