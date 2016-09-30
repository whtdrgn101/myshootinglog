import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import Store from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Router, Store, EventAggregator)
export class Welcome {
  heading = 'Welcome to MyShootingLog!';
  last30Stats = {};
  lifetimeStats = {};

  constructor(router, store, eventAggregator) {
    this.router = router;
    this.store = store;
    this.eventAggregator = eventAggregator;
  }

  activate(parms, routeConfig) {
    this.eventAggregator.publish('viewActivate');
    var self = this;
    this.store.getLast30Stats().then(function(stats){
      self.last30Stats = stats[0];
    });
    this.store.getLifetimeStats().then(function(stats){
      self.lifetimeStats = stats[0];
    });
  }

  get latestRound() {

  }

  get mostUsedBow() {

  }
}
