import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import DataLayer from 'common/shooting-log-store';
import {HttpClient} from 'aurelia-http-client';
import environment from '../environment';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Router, DataLayer, EventAggregator)
export class BowList{

  constructor(_router, _data, _eventAggregator){
    this.appRouter = _router;
    this.store = _data;
    this.eventAggregator = _eventAggregator;
    this.client = new HttpClient().configure(x => {
      x.withBaseUrl(environment.API_URL);
      x.withHeader('x-authorization',this.store.authToken.token);
    });

  }

  heading = 'Your bows';

  newBow() {
    this.appRouter.navigateToRoute('bow', { id: -1 });
  }

  editBow(bow) {
    this.appRouter.navigateToRoute('bow', { id: bow.id });
  }

  deleteBow(bow) {
    var self = this;
    if(confirm("Are you sure you want to delete this bow?")) {
      this.client.delete("/bow/" + bow.id)
        .then(data => {
          self.refreshBows();
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

  activate() {
    this.eventAggregator.publish('viewActivate');
    this.refreshBows();
  }

  refreshBows() {
    var self = this;
    this.client.get("/user/" + this.store.authToken.userId + "/bows")
      .then(data => {
        self.bows = JSON.parse(data.response);
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

export class UpperValueConverter {
  toView(value){
    return value && value.toUpperCase();
  }
}
