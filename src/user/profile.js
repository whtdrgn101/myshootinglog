import {computedFrom, inject, URL} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import ShootingLogStore from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';
import environment from '../environment';
import {HttpClient} from 'aurelia-http-client';

@inject(Router, ShootingLogStore, EventAggregator)
export class Profile {

  heading = "User Profile";
  file;
  user;
  
  constructor(router, shootingLogStore, eventAggregator) {
    this.appRouter = router;
    this.store = shootingLogStore;
    this.dispatcher = eventAggregator;
    this.client = new HttpClient().configure(x => {
      x.withBaseUrl(environment.API_URL);
      x.withHeader('x-authorization',this.store.authToken.token);
    });
  }

  activate() {
    this.dispatcher.publish('viewActivate');
    var self = this;
    this.client.get(`/user/${this.store.authToken.userId}/profile` )
      .then(data => {
        self.user = JSON.parse(data.response);
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

  saveProfile() {
    var self = this;
    this.client.put(`/user/${this.store.authToken.userId}`, JSON.stringify(this.user) )
      .then(data => {
        self.user = JSON.parse(data.response);
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

  embedFile() {
    var self = this;
    if(this.file) {
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          self.user.profile_pic = e.target.result;
        };
      })(this.file[0]);
      reader.readAsDataURL(this.file[0]);
    }

  }
}