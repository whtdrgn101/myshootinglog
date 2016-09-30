import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import DataLayer from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Router, DataLayer, EventAggregator)
export class Welcome{

  heading = 'Your scorecard';
  
  constructor(_router, _data, _eventAggregator){
    this.appRouter = _router;
    this.dataLayer = _data;
    this.eventAggregator = _eventAggregator;
  }

  newRound() {
    this.appRouter.navigateToRoute('round', { id: -1 });
  }

  editRound(round) {
    this.appRouter.navigateToRoute('round', { id: round._id });
  }

  deleteRound(round) {
    if(confirm("Are you sure you want to delete this round?")) {
      this.eventAggregator.publish('round.delete', round._id);
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
