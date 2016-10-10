import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import Store from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';
import environment from 'environment';
import {HttpClient} from 'aurelia-http-client';

@inject(Router, Store, EventAggregator)
export class Welcome {
  heading = 'Welcome to MyShootingLog!';
  last30Stats = {};
  lifetimeStats = {};

  constructor(router, store, eventAggregator) {
    this.router = router;
    this.store = store;
    this.eventAggregator = eventAggregator;
    this.client = new HttpClient().configure(x => {
      x.withBaseUrl(environment.API_URL);
      x.withHeader('x-authorization',this.store.authToken.token);
    });
  }

  activate(parms, routeConfig) {
    this.eventAggregator.publish('viewActivate');
    this.getLifetimeStats();
    this.getLast30Stats();

  }

  getLifetimeStats() {
    var self = this;
    this.client.get("/stats/" + this.store.authToken.userId + "/lifetime")
      .then(data => {
        self.lifetimeStats = JSON.parse(data.response);
      })
      .catch(error => {
        if(error.status === 403) {
          alert('Session timeout, please log in again');
          this.router.navigateToRoute('login');
        } else {
          this.error = "An error occurred while retrieving the job list, please contact support or try again";
        }

      });
  }

  getLast30Stats() {
    var self = this;
    this.client.get("/stats/" + this.store.authToken.userId + "/last30")
      .then(data => {
        self.last30Stats = JSON.parse(data.response);
      })
      .catch(error => {
        if(error.status === 403) {
          alert('Session timeout, please log in again');
          this.router.navigateToRoute('login');
        } else {
          this.error = "An error occurred while retrieving the job list, please contact support or try again";
        }

      });
  }
  get latestRound() {

  }

  get mostUsedBow() {

  }
}
