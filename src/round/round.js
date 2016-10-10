import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import Store from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';
import _ from 'underscore';
import environment from '../environment';
import {HttpClient} from 'aurelia-http-client';

@inject(Router, Store, EventAggregator)
export class Round {
  heading = 'Round';
  roundTypes = [
    'FITA 18',
    'FITA 25',
    'FITA 30',
    'FITA 50',
    'FITA 70',
    'FITA 90',
    'Other'
  ];
  newEndScore = 30;
  newArrowCount = 3;
  round = {};
  
  constructor(router, _store, _EventAggregator){
    this.appRouter = router;
    this.store = _store;
    this.eventAggregator = _EventAggregator;
    var self = this;
    this.eventAggregator.subscribe('roundDate.send', payload => {
      self.handleDateChange(payload);
    });
    this.eventAggregator.subscribe('round.ends.change', payload => {
      self.handleRoundEndsChange(payload);
    });
    this.client = new HttpClient().configure(x => {
      x.withBaseUrl(environment.API_URL);
      x.withHeader('x-authorization',this.store.authToken.token);
    });
    
  }

  activate(parms, routeConfig) {
    this.eventAggregator.publish('viewActivate');
    var self = this;
    this.client.get("/user/" + this.store.authToken.userId + "/bows")
      .then(data => {
        self.bows = JSON.parse(data.response);
        return self.client.get("/roundtype");
      })
      .then(results => {
        self.roundTypes = JSON.parse(results.response);
        if(parms.id != undefined && parms.id !== "-1") {
          this.client.get("/round/" + parms.id)
            .then(data => {
              self.round = JSON.parse(data.response);
            });
        } else {
          self.round = {
            round_date: new Date(),
            total_score: 30,
            ends: [{end_number:1, end_score:30, arrow_count: 3}]
          }
          if(self.bows.length > 0) {
            self.round.bow_id = self.bows[0].id;
          }
          if(self.roundTypes.length > 0) {
            self.round.round_type = self.roundTypes[0].id;
          }
        }
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

  addEnd() {
    this.round.ends.push({end_number:this.round.ends.length + 1, arrow_count: this.newArrowCount, end_score:this.newEndScore});
    this.eventAggregator.publish('round.ends.change', true);
  }
  
  deleteEnd(end) {
    var deletedEnd = _.find(this.round.ends, function(e){return e._id == end._id});
    if(deletedEnd != undefined) {
      this.round.ends = _.without(this.round.ends, deletedEnd);
    }
    var roundNumber = 1;
    this.round.ends.forEach(function(end){
      end.end_number = roundNumber++;
    })
    this.eventAggregator.publish('round.ends.change', true);
  }
  
  endChanged() {
    this.eventAggregator.publish('round.ends.change', true);
  }
  
  save() {
    this.round.total_score = this.calculateRoundScore(this.round);
    
    if(this.round.id === undefined)
    {
      this.addRound();
    } else {
      this.updateRound();
    }
  }

  addRound() {
    this.round.member_id =   this.store.authToken.userId;
    this.client.post("/round", JSON.stringify(this.round))
      .then(data => {
        self.round = JSON.parse(data.response);
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

  updateRound() {
    this.client.put("/round/" + this.round.id, JSON.stringify(this.round))
      .then(data => {
        self.round = JSON.parse(data.response);
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

  handleRoundEndsChange(action, end) {
    this.round.total_score = this.calculateRoundScore(this.round);
  }
  
  calculateRoundScore(_round) {
    var scores = _.map(_round.ends, function(end) {
      return Number(end.end_score);
    });
    return scores.reduce(
      function(total, num){ return ((num)?(total + num):0) }
      , 0);
  }
}
