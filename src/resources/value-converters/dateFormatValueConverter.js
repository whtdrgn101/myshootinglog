import moment from 'moment';
/**
 * Created by tim on 9/30/2016.
 */
export class DateFormatValueConverter {
  toView(value, format) {
    return moment(value).format(format);
  }
  fromView(str, format){
    return moment(str, format);
  }
}
