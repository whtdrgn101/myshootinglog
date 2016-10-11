import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-fetch-client';

@inject(EventAggregator, HttpClient)
export default class ShootingLogStore {

  user = null;
  authToken = null;

  constructor(_eventAggregator, _http){
    this.eventAggregator = _eventAggregator;
    _http.configure(config => {
      config
        .useStandardConfiguration()
        .withDefaults({headers: {
          'Accept': 'application/json',
          'X-Authorization': JSON.stringify(this.authToken)
        }})
        .withBaseUrl('http://www.myshootinglog.com:8080/');
    });
    this.http = _http;
    this.subscribe();
  }

  subscribe(){
    let self = this;
    this.eventAggregator.subscribe('logout', payload => {
      self.handleLogout();
    });
    this.eventAggregator.subscribe('viewActivate', payload => {
      self.handleViewActivate();
    });
    this.eventAggregator.subscribe('user.authenticated', payload => {
      self.handleUserAuthenticated(payload);
    });
  }

  /*************************
   * GLOBAL EVENT HANDLERS *
   *************************/
  handleViewActivate() {
    //Push scorecard into store
    this.user = this.getUserInSession();
    this.authToken = JSON.parse(sessionStorage.getItem('auth-token'));
  }

  handleUserAuthenticated(token) {
    this.authToken = token;
    sessionStorage.setItem('auth-token', JSON.stringify(token));
    this.saveStore();
  }

  handleLogout() {
    this.user = null;
    this.authToken = null;
  }
  
  /*********************
   *       USER
   *********************/
  authenticateUser(_email, _password) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.http.fetch('auth', {
        method: 'post',
        body: JSON.stringify({'email': _email, 'password': _password })
      }).then(response => response.json())
       .then(function(results) {
        self.eventAggregator.publish('user.authenticated', results);
        resolve(results);
      }).catch(error => {
        if(error.status === 401) {
          reject("Invalid username or password");
        } else {
          reject("Unknown error occurred during login.  Please try again later");
        }
      });
    });
  }
  
  getUserInSession() {
    var auth = JSON.parse(sessionStorage.getItem('auth-token'));
    var usr = {isAuthenticated: false};
    if(auth != null) {
      usr.userId = auth.userId;
      usr.isAuthenticated = true;
    }
    return usr;
  }

  saveStore() {
    sessionStorage.store = JSON.stringify(this);
  }

  /**
   * Created the user account and returns the accountID which will be the key
   * the API uses for accessing the users data
   */
  register(_email, _password) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.http.fetch('user', {
        method: 'post',
        body: JSON.stringify({'email': _email, 'password': _password })
      }).then(response => response.json())
        .then(usr => {
        resolve(usr);
      }).catch(error => {
        reject(error);
      });
    });
  }

}
