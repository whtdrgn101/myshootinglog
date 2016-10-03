import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import Store from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';
import _ from 'underscore';

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
    
  }

  activate(parms, routeConfig) {
    this.eventAggregator.publish('viewActivate');
    var self = this;
    if(parms.id != undefined && parms.id !== "-1") {
      this.store.getRound(parms.id).then(function(r){
        self.round = r;
      });
    } else {
      this.round = {
        recordedDate: new Date(),
        score: 30,
        bowId: 1,
        ends: [{number:1, score:30}]
      }
    }
  }

  addEnd() {
    this.round.ends.push({number:this.round.ends.length + 1, score:this.newEndScore});
    this.eventAggregator.publish('round.ends.change', true);
  }
  
  deleteEnd(end) {
    var deletedEnd = _.find(this.round.ends, function(e){return e._id == end._id});
    if(deletedEnd != undefined) {
      this.round.ends = _.without(this.round.ends, deletedEnd);
    }
    var roundNumber = 1;
    this.round.ends.forEach(function(end){
      end.number = roundNumber++;
    })
    this.eventAggregator.publish('round.ends.change', true);
  }
  
  endChanged() {
    this.eventAggregator.publish('round.ends.change', true);
  }
  
  save() {
    this.round.roundScore = this.calculateRoundScore(this.round);
    
    if(this.round._id === undefined)
    {
      this.eventAggregator.publish('round.add', this.round);
    } else {
      this.eventAggregator.publish('round.update',this.round);
    }
    this.appRouter.navigateBack();
  }

  handleDateChange(date) {
    if(this.round.recordedDate != date)
      this.round.recordedDate = date;
  }
  
  handleRoundEndsChange(action, end) {
    this.round.score = this.calculateRoundScore(this.round);
  }
  
  calculateRoundScore(_round) {
    var scores = _.map(_round.ends, function(end) {
      return Number(end.score);
    });
    return scores.reduce(
      function(total, num){ return ((num)?(total + num):0) }
      , 0);
  }
}
