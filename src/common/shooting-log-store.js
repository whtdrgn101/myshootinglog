import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator, HttpClient)
export default class ShootingLogStore {

  user = null;
  scorecard = null;
  errorMessage = null;
  round = null;
  bow = null;
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
    this.eventAggregator.subscribe('scorecard.changed', payload => {
      self.handleScorecardChanged();
    });
    this.eventAggregator.subscribe('logout', payload => {
      self.handleLogout();
    });
    this.eventAggregator.subscribe('viewActivate', payload => {
      self.handleViewActivate();
    });
    //Bow handlers
    this.eventAggregator.subscribe('bow.add', payload => {
      self.handleBowAdd(payload);
    });
    this.eventAggregator.subscribe('bow.update', payload => {
      self.handleBowUpdate(payload);
    });
    this.eventAggregator.subscribe('bow.delete', payload => {
      self.handleBowDelete(payload);
    });
    //Scorecard
    this.eventAggregator.subscribe('round.add', payload => {
      self.handleRoundAdd(payload);
    });
    this.eventAggregator.subscribe('round.delete', payload => {
      self.handleRoundDelete(payload);
    });
    this.eventAggregator.subscribe('round.update', payload => {
      self.handleRoundUpdate(payload);
    });
    this.eventAggregator.subscribe('bowStore.stale', payload => {
      self.handleBowStoreStale(payload);
    });
    this.eventAggregator.subscribe('roundStore.stale', payload => {
      self.handleRoundStoreStale(payload);
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
  }

  handleLogout() {
    this.user = null;
    this.authToken = null;
  }
  
  handleScorecardChanged() {
    var user = this.getUserInSession();
    var self = this;
    //Hack to make mongoose behave.  Need to clean this up at the API side
    this.scorecard._id = undefined;
    this.scorecard.id = undefined;
    return new Promise(function (resolve, reject) {
      self.http.fetch('scorecard/' + user.userId, {
        method: 'put',
        body: JSON.stringify(self.scorecard)
      }).then(function(results) {
        resolve(results);
      })
    });
  }
  
  /************************
   * ROUND EVENT HANDLERS *
   ************************/
  handleRoundDelete(roundId) {
    var user = this.getUserInSession();
    var self = this;
    this.http.fetch('scorecard/' + user.userId + '/rounds/' + roundId, {method: 'delete'})
      .then(function(results) {
        self.eventAggregator.publish('roundStore.stale');
      });
  }
  
  handleRoundAdd(round) {
    var user = this.getUserInSession();
    var self = this;
    this.http.fetch('scorecard/' + user.userId + '/rounds', {
      method: 'post',
      body: JSON.stringify(round)
    }).then(function(results) {
        self.eventAggregator.publish('roundStore.stale');
      });
  }
  
  handleRoundUpdate(round) {
    var user = this.getUserInSession();
    var self = this;
    this.http.fetch('scorecard/' + user.userId + '/rounds/' + round._id, {
      method: 'put',
      body: JSON.stringify(round)
    }).then(function(results) {
        self.eventAggregator.publish('roundStore.stale');
      });
  }
  
  handleRoundStoreStale() {
    var user = this.getUserInSession();
    var self = this;
    this.http.fetch('scorecard/' + user.userId + '/rounds')
      .then(response => response.json())
      .then(function(rounds) {
        self.scorecard.rounds = rounds;
        });
  }
  
  /**********************
   * BOW EVENT HANDLERS *
   **********************/
  handleBowAdd(bow) {
    var user = this.getUserInSession();
    var self = this;
    this.http.fetch('scorecard/' + user.userId + '/bows', {
      method: 'post',
      body: JSON.stringify(bow)
    }).then(function(results) {
        self.eventAggregator.publish('bowStore.stale');
      });
  }

  handleBowUpdate(bow) {
    var user = this.getUserInSession();
    var self = this;
    this.http.fetch('scorecard/' + user.userId + '/bows/' + bow._id, {
      method: 'put',
      body: JSON.stringify(bow)
    }).then(function(results) {
        self.eventAggregator.publish('bowStore.stale');
      });
  }

  handleBowDelete(bowId) {
    var user = this.getUserInSession();
    var self = this;
    this.http.fetch('scorecard/' + user.userId + '/bows/' + bowId, {method: 'delete'})
      .then(function(results) {
        self.eventAggregator.publish('bowStore.stale');
      });
  }
  
  handleBowStoreStale() {
    var user = this.getUserInSession();
    var self = this;
    this.http.fetch('scorecard/' + user.userId + '/bows')
      .then(response => response.json())
      .then(function(bows) {
        self.scorecard.bows = bows;
      });
  }
  
  /***********
   * METHODS *
   ***********/
  getScorecard(userId) {
    var self = this;
    return new Promise(function (resolve, reject) {
      if(self.scorecard == null || self.scorecard == undefined) {
        
        self.http.fetch('scorecard/'+ userId)
        .then(response => response.json())
        .then(function(results) {
          resolve(results);
        })
        
      } else {
        resolve(self.scorecard);
      }
    });
  }

  getBow(bowId) {
    var user = this.getUserInSession();
    var self = this;
    return new Promise(function (resolve, reject) {
      self.http.fetch('scorecard/' + user.userId + '/bows/' + bowId)
      .then(response => response.json())
      .then(function(bow) {
        resolve(bow);
        });
    });
  }
  
  getRound(roundId) {
    var user = this.getUserInSession();
    var self = this;
    return new Promise(function (resolve, reject) {
      self.http.fetch('scorecard/' + user.userId + '/rounds/' + roundId)
      .then(response => response.json())
      .then(function(round) {
        resolve(round);
        });
    });
  }

  getLast30Stats() {
    var user = this.getUserInSession();
    var self = this;
    return new Promise(function (resolve, reject) {
      self.http.fetch('stats/' + user.userId + '/last30')
        .then(response => response.json())
        .then(function(round) {
          resolve(round);
        });
    });
  }

  getLifetimeStats() {
    var user = this.getUserInSession();
    var self = this;
    return new Promise(function (resolve, reject) {
      self.http.fetch('stats/' + user.userId + '/lifetime')
        .then(response => response.json())
        .then(function(round) {
          resolve(round);
        });
    });
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

  /**
   * TODO: Kill this stupid method!
   */
  getUserDetails(user) {
    let userDetails = {
      name: '',
      location: '',
      image: ''
    };
    if(this.scorecard.user.userId === user.userId) {
      userDetails.name =  this.scorecard.user.details.name;
      userDetails.location =  this.scorecard.user.details.location;
      userDetails.image =  this.scorecard.user.details.image;
    }
    return userDetails;
  }

  /**
   * Created the Firebase account and returns the accountID which will be the key
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
  
  /**
   * After registration, the users scorecard must be initialized by POSTing a 
   * stub record to the API.  
   */
  initUserScorecard(user) {
    var card = {
      user: {
        accountId: user._id,
        email: user.email
      },
      rounds: [],
      bows: []
    }
    var self = this;
    return new Promise(function (resolve, reject) {
      self.http.fetch('scorecard', {
        method: 'post',
        body: JSON.stringify(card)
      }).then(function(results) {
        resolve(results);
      })
    });
  }
  

}
