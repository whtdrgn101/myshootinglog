import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import Store from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Router, Store, EventAggregator)
export class Bow {
  
  heading = 'Bow Details';
  bow = {};
  bowTypes = [
    'Compound',
    'Crossbow',
    'Longbow',
    'Recurve',
    'Self',
    'Stick'
  ];
  constructor(router, _store, _eventAggregator){
    this.appRouter = router;
    this.store = _store;
    this.eventAggregator = _eventAggregator;
  }

  activate(parms, routeConfig) {
    this.eventAggregator.publish('viewActivate');
    var self = this;
    if(parms.id != undefined && parms.id !== "-1") {
      this.store.getBow(parms.id).then(function(b){
        self.bow = b;
      });
    } else {
      this.bow = {
        name: 'New Bow',
        make: 'Hoyte',
        model: 'Podium',
        type: 'Recurve',
        poundage: 55,
        amoLength: "62",
        braceHeight: "6.5"
      }
    }
  }

  save() {
    if(this.bow._id === undefined)
    {
      this.eventAggregator.publish('bow.add', this.bow);
    } else {
      this.eventAggregator.publish('bow.update', this.bow);
    }
    this.appRouter.navigateBack();  
  }
}
