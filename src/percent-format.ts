import * as numeral from 'numeral';

export class PercentFormatValueConverter {
  toView(value) {
    return numeral(value).format('(0%)');
  }
}
