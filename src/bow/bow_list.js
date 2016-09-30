import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import DataLayer from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Router, DataLayer, EventAggregator)
export class BowList{

  constructor(_router, _data, _eventAggregator){
    this.appRouter = _router;
    this.dataLayer = _data;
    this.eventAggregator = _eventAggregator;
  }

  heading = 'Your bows';

  newBow() {
    this.appRouter.navigateToRoute('bow', { id: -1 });
  }

  editBow(bow) {
    this.appRouter.navigateToRoute('bow', { id: bow._id });
  }

  deleteBow(bowId) {
    if(confirm("Are you sure you want to delete t his bow?")) {
      this.eventAggregator.publish('bow.delete', bowId._id);
    }
  }

  activate() {
    this.eventAggregator.publish('viewActivate');
  }
}

export class UpperValueConverter {
  toView(value){
    return value && value.toUpperCase();
  }
}
