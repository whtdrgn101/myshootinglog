import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import Store from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';
import environment from '../environment';
import {HttpClient} from 'aurelia-http-client';

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
    this.client = new HttpClient().configure(x => {
      x.withBaseUrl(environment.API_URL);
      x.withHeader('x-authorization',this.store.authToken.token);
    });
  }

  activate(parms, routeConfig) {
    this.eventAggregator.publish('viewActivate');
    this.getBowTypes();
    var self = this;
    if(parms.id != undefined && parms.id !== "-1") {
      this.client.get("/bow/" + parms.id)
        .then(data => {
          this.bow = JSON.parse(data.response);
        })
        .catch(error => {
          if(error.status === 403) {
            alert('Session timeout, please log in again');
            this.store.clearStore();
            this.router.navigateToRoute('login');
          } else {
            this.error = "An error occurred while retrieving the job list, please contact support or try again";
          }

        });
    }
  }

  save() {
    if(this.bow.id === undefined)
    {
      this.addBow();
    } else {
      this.updateBow();
    }

  }

  updateBow() {
    var self = this;
    this.client.put("/bow/" + this.bow.id, JSON.stringify(this.bow))
      .then(data => {
        self.bow = JSON.parse(data.response);
        this.appRouter.navigateBack();
      })
      .catch(error => {
        if(error.status === 403) {
          alert('Session timeout, please log in again');
          this.store.clearStore();
          this.router.navigateToRoute('login');
        } else {
          this.error = "An error occurred while retrieving the job list, please contact support or try again";
        }

      });
  }

  addBow() {
    var self = this;
    this.bow.member_id = this.store.authToken.userId;
    this.client.post("/bow", JSON.stringify(this.bow))
      .then(data => {
        self.bow = JSON.parse(data.response);
        this.appRouter.navigateBack();
      })
      .catch(error => {
        if(error.status === 403) {
          alert('Session timeout, please log in again');
          this.store.clearStore();
          this.router.navigateToRoute('login');
        } else {
          this.error = "An error occurred while retrieving the job list, please contact support or try again";
        }

      });
  }

  getBowTypes() {
    var self = this;
    this.client.get("/bowtype", JSON.stringify(this.bow))
      .then(data => {
        self.bowTypes = JSON.parse(data.response);
      })
      .catch(error => {
        if(error.status === 403) {
          alert('Session timeout, please log in again');
          this.store.clearStore();
          this.router.navigateToRoute('login');
        } else {
          this.error = "An error occurred while retrieving list of bow types, please contact support or try again";
        }

      });
  }
}
