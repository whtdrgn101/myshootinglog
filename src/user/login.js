import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import DataLayer from 'common/shooting-log-store';

@inject(Router, DataLayer, EventAggregator)
export class Login {
  
  errorMessage = null;
  
  user = {
      email: '',
      password: ''
  }
  
  constructor(router, _dl, _eventAggregator){
    this.appRouter = router;
    this.store = _dl;
    this.eventAggregator = _eventAggregator;
  }
  
  loginUser() {
    var self = this;
    self.errorMessage = null;
    this.store.authenticateUser(this.user.email, this.user.password)
      .then(user => {
        if(user) {
          self.eventAggregator.publish('login.success', true);
          self.appRouter.navigateToRoute('home');
        }
      }).catch(error => {
        self.errorMessage = error;
      });
  }
}
