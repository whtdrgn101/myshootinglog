import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import DataLayer from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';
import environment from '../environment';
import {HttpClient} from 'aurelia-http-client';

@inject(Router, DataLayer, EventAggregator)
export class Welcome{

  heading = 'Your scorecard';
  roundTypes = [];
  newRoundType = 1;
  
  constructor(_router, _data, _eventAggregator){
    this.appRouter = _router;
    this.store = _data;
    this.eventAggregator = _eventAggregator;
    this.client = new HttpClient().configure(x => {
      x.withBaseUrl(environment.API_URL);
      x.withHeader('x-authorization',this.store.authToken.token);
    });
  }

  newRound() {
    this.appRouter.navigateToRoute('round', { id: -1, roundType: this.newRoundType });
  }

  editRound(round) {
    this.appRouter.navigateToRoute('round', { id: round.id });
  }

  deleteRound(round) {
    var self = this;
    if(confirm("Are you sure you want to delete this round?")) {
      this.client.delete("/round/" + round.id)
        .then(data => {
          self.refreshRounds();
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
    this.refreshRounds();
    var self = this;
    this.client.get("/roundtype").then(results => {
      self.roundTypes = JSON.parse(results.response);
    });
  }

  refreshRounds() {
    var self = this;
    this.client.get("/user/" + this.store.authToken.userId + "/rounds")
      .then(data => {
        self.rounds = JSON.parse(data.response);
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

