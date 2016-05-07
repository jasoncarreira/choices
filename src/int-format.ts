import * as numeral from "numeral";

export class IntFormatValueConverter {
  toView(value) {
    return numeral(value).format('0');
  }

  fromView(stringVal) {
    let regex = /^\d+$/;
    if (regex.test(stringVal)) {
      return parseInt(stringVal.replace(/[^\d\.\-]/g, ""));
    }
    return 0;
  }
}
