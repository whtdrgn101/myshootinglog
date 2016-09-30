/**
 * Created by tim on 9/30/2016.
 */
/**
 * Created by tdewees on 8/19/2016.
 */
export class DateFormatValueConverter {

  constructor() {

  }

  toView(date){

    var options = { year: "2-digit", month: "2-digit", day: "2-digit"};
    var americanDateTime = new Intl.DateTimeFormat("en-US", options).format;
    try {
      var dt = americanDateTime(new Date(date));
      return dt;
    } catch (error) {
      return "";
    }
  }
}
