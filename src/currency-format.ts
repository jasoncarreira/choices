import * as numeral from "numeral";

export class CurrencyFormatValueConverter {
  toView(value) {
    return numeral(value).format('($0,0)');
  }

  fromView(stringVal) {
    let regex = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
    if (regex.test(stringVal)) {
      return parseFloat(stringVal.replace(/[^\d\.\-]/g, ""));
    }
    return 0;
  }
}
