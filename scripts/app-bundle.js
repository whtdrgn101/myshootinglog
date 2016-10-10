define('app',['exports', 'aurelia-framework', 'aurelia-router', 'common/shooting-log-store'], function (exports, _aureliaFramework, _aureliaRouter, _shootingLogStore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_shootingLogStore2.default), _dec(_class = function () {
    function App(_store) {
      _classCallCheck(this, App);

      this.store = _store;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'My Shooting Log';
      config.addPipelineStep('authorize', AuthorizeStep);
      config.map([{ route: ['', 'welcome'], name: 'home', moduleId: 'welcome', auth: true, nav: true, title: 'Home' }, { route: ['scorecard'], name: 'scorecard', moduleId: 'round/scorecard', auth: true, nav: true, title: 'Scorecard' }, { route: ['round'], name: 'round', moduleId: 'round/round', auth: true, nav: false, title: 'Round' }, { route: ['bow_list'], name: 'bow_list', moduleId: 'bow/bow_list', auth: true, nav: true, title: 'Bows' }, { route: ['bow'], name: 'bow', moduleId: 'bow/bow', auth: true, nav: false, title: 'Bow Details' }, { route: ['profile'], name: 'profile', moduleId: 'user/profile', auth: true, nav: true, title: 'Profile' }, { route: ['login'], name: 'login', moduleId: 'user/login', auth: false, nav: false, title: 'Login' }, { route: ['register'], name: 'register', moduleId: 'user/register', auth: false, nav: false, title: 'Register' }]);

      this.router = router;
    };

    return App;
  }()) || _class);

  var AuthorizeStep = function () {
    function AuthorizeStep() {
      _classCallCheck(this, AuthorizeStep);
    }

    AuthorizeStep.prototype.run = function run(navigationInstruction, next) {
      if (navigationInstruction.getAllInstructions().some(function (i) {
        return i.config.auth;
      })) {
        var auth = JSON.parse(sessionStorage.getItem('auth-token'));
        if (auth == null) {
          return next.cancel(new _aureliaRouter.Redirect('login'));
        }
      }

      return next();
    };

    return AuthorizeStep;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true,
    API_URL: "http://www.myshootinglog.com:8080"
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('welcome',['exports', 'aurelia-framework', 'aurelia-router', 'common/shooting-log-store', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaRouter, _shootingLogStore, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Welcome = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var Welcome = exports.Welcome = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _shootingLogStore2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Welcome(router, store, eventAggregator) {
      _classCallCheck(this, Welcome);

      this.heading = 'Welcome to MyShootingLog!';
      this.last30Stats = {};
      this.lifetimeStats = {};

      this.router = router;
      this.store = store;
      this.eventAggregator = eventAggregator;
    }

    Welcome.prototype.activate = function activate(parms, routeConfig) {
      this.eventAggregator.publish('viewActivate');
      var self = this;
      this.store.getLast30Stats().then(function (stats) {
        self.last30Stats = stats[0];
      });
      this.store.getLifetimeStats().then(function (stats) {
        self.lifetimeStats = stats[0];
      });
    };

    _createClass(Welcome, [{
      key: 'latestRound',
      get: function get() {}
    }, {
      key: 'mostUsedBow',
      get: function get() {}
    }]);

    return Welcome;
  }()) || _class);
});
define('bow/bow',['exports', 'aurelia-framework', 'aurelia-router', 'common/shooting-log-store', 'aurelia-event-aggregator', '../environment', 'aurelia-http-client'], function (exports, _aureliaFramework, _aureliaRouter, _shootingLogStore, _aureliaEventAggregator, _environment, _aureliaHttpClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Bow = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Bow = exports.Bow = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _shootingLogStore2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Bow(router, _store, _eventAggregator) {
      var _this = this;

      _classCallCheck(this, Bow);

      this.heading = 'Bow Details';
      this.bow = {};
      this.bowTypes = ['Compound', 'Crossbow', 'Longbow', 'Recurve', 'Self', 'Stick'];

      this.appRouter = router;
      this.store = _store;
      this.eventAggregator = _eventAggregator;
      this.client = new _aureliaHttpClient.HttpClient().configure(function (x) {
        x.withBaseUrl(_environment2.default.API_URL);
        x.withHeader('x-authorization', _this.store.authToken.token);
      });
    }

    Bow.prototype.activate = function activate(parms, routeConfig) {
      var _this2 = this;

      this.eventAggregator.publish('viewActivate');
      this.getBowTypes();
      var self = this;
      if (parms.id != undefined && parms.id !== "-1") {
        this.client.get("/bow/" + parms.id).then(function (data) {
          _this2.bow = JSON.parse(data.response);
        }).catch(function (error) {
          if (error.status === 403) {
            alert('Session timeout, please log in again');
            _this2.store.clearStore();
            _this2.router.navigateToRoute('login');
          } else {
            _this2.error = "An error occurred while retrieving the job list, please contact support or try again";
          }
        });
      }
    };

    Bow.prototype.save = function save() {
      if (this.bow.id === undefined) {
        this.addBow();
      } else {
        this.updateBow();
      }
    };

    Bow.prototype.updateBow = function updateBow() {
      var _this3 = this;

      var self = this;
      this.client.put("/bow/" + this.bow.id, JSON.stringify(this.bow)).then(function (data) {
        self.bow = JSON.parse(data.response);
        _this3.appRouter.navigateBack();
      }).catch(function (error) {
        if (error.status === 403) {
          alert('Session timeout, please log in again');
          _this3.store.clearStore();
          _this3.router.navigateToRoute('login');
        } else {
          _this3.error = "An error occurred while retrieving the job list, please contact support or try again";
        }
      });
    };

    Bow.prototype.addBow = function addBow() {
      var _this4 = this;

      var self = this;
      this.bow.member_id = this.store.authToken.userId;
      this.client.post("/bow", JSON.stringify(this.bow)).then(function (data) {
        self.bow = JSON.parse(data.response);
        _this4.appRouter.navigateBack();
      }).catch(function (error) {
        if (error.status === 403) {
          alert('Session timeout, please log in again');
          _this4.store.clearStore();
          _this4.router.navigateToRoute('login');
        } else {
          _this4.error = "An error occurred while retrieving the job list, please contact support or try again";
        }
      });
    };

    Bow.prototype.getBowTypes = function getBowTypes() {
      var _this5 = this;

      var self = this;
      this.client.get("/bowtype", JSON.stringify(this.bow)).then(function (data) {
        self.bowTypes = JSON.parse(data.response);
      }).catch(function (error) {
        if (error.status === 403) {
          alert('Session timeout, please log in again');
          _this5.store.clearStore();
          _this5.router.navigateToRoute('login');
        } else {
          _this5.error = "An error occurred while retrieving list of bow types, please contact support or try again";
        }
      });
    };

    return Bow;
  }()) || _class);
});
define('bow/bow_list',['exports', 'aurelia-framework', 'aurelia-router', 'common/shooting-log-store', 'aurelia-http-client', '../environment', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaRouter, _shootingLogStore, _aureliaHttpClient, _environment, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UpperValueConverter = exports.BowList = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var BowList = exports.BowList = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _shootingLogStore2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function BowList(_router, _data, _eventAggregator) {
      var _this = this;

      _classCallCheck(this, BowList);

      this.heading = 'Your bows';

      this.appRouter = _router;
      this.store = _data;
      this.eventAggregator = _eventAggregator;
      this.client = new _aureliaHttpClient.HttpClient().configure(function (x) {
        x.withBaseUrl(_environment2.default.API_URL);
        x.withHeader('x-authorization', _this.store.authToken.token);
      });
    }

    BowList.prototype.newBow = function newBow() {
      this.appRouter.navigateToRoute('bow', { id: -1 });
    };

    BowList.prototype.editBow = function editBow(bow) {
      this.appRouter.navigateToRoute('bow', { id: bow.id });
    };

    BowList.prototype.deleteBow = function deleteBow(bow) {
      var _this2 = this;

      var self = this;
      if (confirm("Are you sure you want to delete this bow?")) {
        this.client.delete("/bow/" + bow.id).then(function (data) {
          self.refreshBows();
        }).catch(function (error) {
          if (error.status === 403) {
            alert('Session timeout, please log in again');
            _this2.store.clearStore();
            _this2.router.navigateToRoute('login');
          } else {
            _this2.error = "An error occurred while retrieving the job list, please contact support or try again";
          }
        });
      }
    };

    BowList.prototype.activate = function activate() {
      this.eventAggregator.publish('viewActivate');
      this.refreshBows();
    };

    BowList.prototype.refreshBows = function refreshBows() {
      var _this3 = this;

      var self = this;
      this.client.get("/user/" + this.store.authToken.userId + "/bows").then(function (data) {
        self.bows = JSON.parse(data.response);
      }).catch(function (error) {
        if (error.status === 403) {
          alert('Session timeout, please log in again');
          _this3.store.clearStore();
          _this3.router.navigateToRoute('login');
        } else {
          _this3.error = "An error occurred while retrieving the job list, please contact support or try again";
        }
      });
    };

    return BowList;
  }()) || _class);

  var UpperValueConverter = exports.UpperValueConverter = function () {
    function UpperValueConverter() {
      _classCallCheck(this, UpperValueConverter);
    }

    UpperValueConverter.prototype.toView = function toView(value) {
      return value && value.toUpperCase();
    };

    return UpperValueConverter;
  }();
});
define('common/shooting-log-store',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ShootingLogStore = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _aureliaFetchClient.HttpClient), _dec(_class = function () {
    function ShootingLogStore(_eventAggregator, _http) {
      var _this = this;

      _classCallCheck(this, ShootingLogStore);

      this.user = null;
      this.scorecard = null;
      this.errorMessage = null;
      this.round = null;
      this.bow = null;
      this.authToken = null;

      this.eventAggregator = _eventAggregator;
      _http.configure(function (config) {
        config.useStandardConfiguration().withDefaults({ headers: {
            'Accept': 'application/json',
            'X-Authorization': JSON.stringify(_this.authToken)
          } }).withBaseUrl('http://www.myshootinglog.com:8080/');
      });
      this.http = _http;
      this.subscribe();
    }

    ShootingLogStore.prototype.subscribe = function subscribe() {
      var self = this;
      this.eventAggregator.subscribe('scorecard.changed', function (payload) {
        self.handleScorecardChanged();
      });
      this.eventAggregator.subscribe('logout', function (payload) {
        self.handleLogout();
      });
      this.eventAggregator.subscribe('viewActivate', function (payload) {
        self.handleViewActivate();
      });

      this.eventAggregator.subscribe('bow.add', function (payload) {
        self.handleBowAdd(payload);
      });
      this.eventAggregator.subscribe('bow.update', function (payload) {
        self.handleBowUpdate(payload);
      });
      this.eventAggregator.subscribe('bow.delete', function (payload) {
        self.handleBowDelete(payload);
      });

      this.eventAggregator.subscribe('round.add', function (payload) {
        self.handleRoundAdd(payload);
      });
      this.eventAggregator.subscribe('round.delete', function (payload) {
        self.handleRoundDelete(payload);
      });
      this.eventAggregator.subscribe('round.update', function (payload) {
        self.handleRoundUpdate(payload);
      });
      this.eventAggregator.subscribe('bowStore.stale', function (payload) {
        self.handleBowStoreStale(payload);
      });
      this.eventAggregator.subscribe('roundStore.stale', function (payload) {
        self.handleRoundStoreStale(payload);
      });
      this.eventAggregator.subscribe('user.authenticated', function (payload) {
        self.handleUserAuthenticated(payload);
      });
    };

    ShootingLogStore.prototype.handleViewActivate = function handleViewActivate() {
      this.user = this.getUserInSession();
      this.authToken = JSON.parse(sessionStorage.getItem('auth-token'));
    };

    ShootingLogStore.prototype.handleUserAuthenticated = function handleUserAuthenticated(token) {
      this.authToken = token;
      sessionStorage.setItem('auth-token', JSON.stringify(token));
    };

    ShootingLogStore.prototype.handleLogout = function handleLogout() {
      this.user = null;
      this.authToken = null;
    };

    ShootingLogStore.prototype.handleScorecardChanged = function handleScorecardChanged() {
      var user = this.getUserInSession();
      var self = this;

      this.scorecard._id = undefined;
      this.scorecard.id = undefined;
      return new Promise(function (resolve, reject) {
        self.http.fetch('scorecard/' + user.userId, {
          method: 'put',
          body: JSON.stringify(self.scorecard)
        }).then(function (results) {
          resolve(results);
        });
      });
    };

    ShootingLogStore.prototype.handleRoundDelete = function handleRoundDelete(roundId) {
      var user = this.getUserInSession();
      var self = this;
      this.http.fetch('scorecard/' + user.userId + '/rounds/' + roundId, { method: 'delete' }).then(function (results) {
        self.eventAggregator.publish('roundStore.stale');
      });
    };

    ShootingLogStore.prototype.handleRoundAdd = function handleRoundAdd(round) {
      var user = this.getUserInSession();
      var self = this;
      this.http.fetch('scorecard/' + user.userId + '/rounds', {
        method: 'post',
        body: JSON.stringify(round)
      }).then(function (results) {
        self.eventAggregator.publish('roundStore.stale');
      });
    };

    ShootingLogStore.prototype.handleRoundUpdate = function handleRoundUpdate(round) {
      var user = this.getUserInSession();
      var self = this;
      this.http.fetch('scorecard/' + user.userId + '/rounds/' + round._id, {
        method: 'put',
        body: JSON.stringify(round)
      }).then(function (results) {
        self.eventAggregator.publish('roundStore.stale');
      });
    };

    ShootingLogStore.prototype.handleRoundStoreStale = function handleRoundStoreStale() {
      var user = this.getUserInSession();
      var self = this;
      this.http.fetch('scorecard/' + user.userId + '/rounds').then(function (response) {
        return response.json();
      }).then(function (rounds) {
        self.scorecard.rounds = rounds;
      });
    };

    ShootingLogStore.prototype.handleBowAdd = function handleBowAdd(bow) {
      var user = this.getUserInSession();
      var self = this;
      this.http.fetch('scorecard/' + user.userId + '/bows', {
        method: 'post',
        body: JSON.stringify(bow)
      }).then(function (results) {
        self.eventAggregator.publish('bowStore.stale');
      });
    };

    ShootingLogStore.prototype.handleBowUpdate = function handleBowUpdate(bow) {
      var user = this.getUserInSession();
      var self = this;
      this.http.fetch('scorecard/' + user.userId + '/bows/' + bow._id, {
        method: 'put',
        body: JSON.stringify(bow)
      }).then(function (results) {
        self.eventAggregator.publish('bowStore.stale');
      });
    };

    ShootingLogStore.prototype.handleBowDelete = function handleBowDelete(bowId) {
      var user = this.getUserInSession();
      var self = this;
      this.http.fetch('scorecard/' + user.userId + '/bows/' + bowId, { method: 'delete' }).then(function (results) {
        self.eventAggregator.publish('bowStore.stale');
      });
    };

    ShootingLogStore.prototype.handleBowStoreStale = function handleBowStoreStale() {
      var user = this.getUserInSession();
      var self = this;
      this.http.fetch('scorecard/' + user.userId + '/bows').then(function (response) {
        return response.json();
      }).then(function (bows) {
        self.scorecard.bows = bows;
      });
    };

    ShootingLogStore.prototype.getScorecard = function getScorecard(userId) {
      var self = this;
      return new Promise(function (resolve, reject) {
        if (self.scorecard == null || self.scorecard == undefined) {

          self.http.fetch('scorecard/' + userId).then(function (response) {
            return response.json();
          }).then(function (results) {
            resolve(results);
          });
        } else {
          resolve(self.scorecard);
        }
      });
    };

    ShootingLogStore.prototype.getBow = function getBow(bowId) {
      var user = this.getUserInSession();
      var self = this;
      return new Promise(function (resolve, reject) {
        self.http.fetch('scorecard/' + user.userId + '/bows/' + bowId).then(function (response) {
          return response.json();
        }).then(function (bow) {
          resolve(bow);
        });
      });
    };

    ShootingLogStore.prototype.getRound = function getRound(roundId) {
      var user = this.getUserInSession();
      var self = this;
      return new Promise(function (resolve, reject) {
        self.http.fetch('scorecard/' + user.userId + '/rounds/' + roundId).then(function (response) {
          return response.json();
        }).then(function (round) {
          resolve(round);
        });
      });
    };

    ShootingLogStore.prototype.getLast30Stats = function getLast30Stats() {
      var user = this.getUserInSession();
      var self = this;
      return new Promise(function (resolve, reject) {
        self.http.fetch('stats/' + user.userId + '/last30').then(function (response) {
          return response.json();
        }).then(function (round) {
          resolve(round);
        });
      });
    };

    ShootingLogStore.prototype.getLifetimeStats = function getLifetimeStats() {
      var user = this.getUserInSession();
      var self = this;
      return new Promise(function (resolve, reject) {
        self.http.fetch('stats/' + user.userId + '/lifetime').then(function (response) {
          return response.json();
        }).then(function (round) {
          resolve(round);
        });
      });
    };

    ShootingLogStore.prototype.authenticateUser = function authenticateUser(_email, _password) {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.http.fetch('auth', {
          method: 'post',
          body: JSON.stringify({ 'email': _email, 'password': _password })
        }).then(function (response) {
          return response.json();
        }).then(function (results) {
          self.eventAggregator.publish('user.authenticated', results);
          resolve(results);
        }).catch(function (error) {
          if (error.status === 401) {
            reject("Invalid username or password");
          } else {
            reject("Unknown error occurred during login.  Please try again later");
          }
        });
      });
    };

    ShootingLogStore.prototype.getUserInSession = function getUserInSession() {
      var auth = JSON.parse(sessionStorage.getItem('auth-token'));
      var usr = { isAuthenticated: false };
      if (auth != null) {
        usr.userId = auth.userId;
        usr.isAuthenticated = true;
      }
      return usr;
    };

    ShootingLogStore.prototype.getUserDetails = function getUserDetails(user) {
      var userDetails = {
        name: '',
        location: '',
        image: ''
      };
      if (this.scorecard.user.userId === user.userId) {
        userDetails.name = this.scorecard.user.details.name;
        userDetails.location = this.scorecard.user.details.location;
        userDetails.image = this.scorecard.user.details.image;
      }
      return userDetails;
    };

    ShootingLogStore.prototype.register = function register(_email, _password) {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.http.fetch('user', {
          method: 'post',
          body: JSON.stringify({ 'email': _email, 'password': _password })
        }).then(function (response) {
          return response.json();
        }).then(function (usr) {
          resolve(usr);
        }).catch(function (error) {
          reject(error);
        });
      });
    };

    ShootingLogStore.prototype.initUserScorecard = function initUserScorecard(user) {
      var card = {
        user: {
          accountId: user._id,
          email: user.email
        },
        rounds: [],
        bows: []
      };
      var self = this;
      return new Promise(function (resolve, reject) {
        self.http.fetch('scorecard', {
          method: 'post',
          body: JSON.stringify(card)
        }).then(function (results) {
          resolve(results);
        });
      });
    };

    return ShootingLogStore;
  }()) || _class);
  exports.default = ShootingLogStore;
});
define('round/round',['exports', 'aurelia-framework', 'aurelia-router', 'common/shooting-log-store', 'aurelia-event-aggregator', 'underscore'], function (exports, _aureliaFramework, _aureliaRouter, _shootingLogStore, _aureliaEventAggregator, _underscore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Round = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  var _underscore2 = _interopRequireDefault(_underscore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Round = exports.Round = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _shootingLogStore2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Round(router, _store, _EventAggregator) {
      _classCallCheck(this, Round);

      this.heading = 'Round';
      this.roundTypes = ['FITA 18', 'FITA 25', 'FITA 30', 'FITA 50', 'FITA 70', 'FITA 90', 'Other'];
      this.newEndScore = 30;
      this.round = {};

      this.appRouter = router;
      this.store = _store;
      this.eventAggregator = _EventAggregator;
      var self = this;
      this.eventAggregator.subscribe('roundDate.send', function (payload) {
        self.handleDateChange(payload);
      });
      this.eventAggregator.subscribe('round.ends.change', function (payload) {
        self.handleRoundEndsChange(payload);
      });
    }

    Round.prototype.activate = function activate(parms, routeConfig) {
      this.eventAggregator.publish('viewActivate');
      var self = this;
      if (parms.id != undefined && parms.id !== "-1") {
        this.store.getRound(parms.id).then(function (r) {
          self.round = r;
        });
      } else {
        this.round = {
          recordedDate: new Date(),
          score: 30,
          bowId: 1,
          ends: [{ number: 1, score: 30 }]
        };
      }
    };

    Round.prototype.addEnd = function addEnd() {
      this.round.ends.push({ number: this.round.ends.length + 1, score: this.newEndScore });
      this.eventAggregator.publish('round.ends.change', true);
    };

    Round.prototype.deleteEnd = function deleteEnd(end) {
      var deletedEnd = _underscore2.default.find(this.round.ends, function (e) {
        return e._id == end._id;
      });
      if (deletedEnd != undefined) {
        this.round.ends = _underscore2.default.without(this.round.ends, deletedEnd);
      }
      var roundNumber = 1;
      this.round.ends.forEach(function (end) {
        end.number = roundNumber++;
      });
      this.eventAggregator.publish('round.ends.change', true);
    };

    Round.prototype.endChanged = function endChanged() {
      this.eventAggregator.publish('round.ends.change', true);
    };

    Round.prototype.save = function save() {
      this.round.roundScore = this.calculateRoundScore(this.round);

      if (this.round._id === undefined) {
        this.eventAggregator.publish('round.add', this.round);
      } else {
        this.eventAggregator.publish('round.update', this.round);
      }
      this.appRouter.navigateBack();
    };

    Round.prototype.handleDateChange = function handleDateChange(date) {
      if (this.round.recordedDate != date) this.round.recordedDate = date;
    };

    Round.prototype.handleRoundEndsChange = function handleRoundEndsChange(action, end) {
      this.round.score = this.calculateRoundScore(this.round);
    };

    Round.prototype.calculateRoundScore = function calculateRoundScore(_round) {
      var scores = _underscore2.default.map(_round.ends, function (end) {
        return Number(end.score);
      });
      return scores.reduce(function (total, num) {
        return num ? total + num : 0;
      }, 0);
    };

    return Round;
  }()) || _class);
});
define('round/scorecard',['exports', 'aurelia-framework', 'aurelia-router', 'common/shooting-log-store', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaRouter, _shootingLogStore, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UpperValueConverter = exports.Welcome = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Welcome = exports.Welcome = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _shootingLogStore2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Welcome(_router, _data, _eventAggregator) {
      _classCallCheck(this, Welcome);

      this.heading = 'Your scorecard';

      this.appRouter = _router;
      this.dataLayer = _data;
      this.eventAggregator = _eventAggregator;
    }

    Welcome.prototype.newRound = function newRound() {
      this.appRouter.navigateToRoute('round', { id: -1 });
    };

    Welcome.prototype.editRound = function editRound(round) {
      this.appRouter.navigateToRoute('round', { id: round._id });
    };

    Welcome.prototype.deleteRound = function deleteRound(round) {
      if (confirm("Are you sure you want to delete this round?")) {
        this.eventAggregator.publish('round.delete', round._id);
      }
    };

    Welcome.prototype.activate = function activate() {
      this.eventAggregator.publish('viewActivate');
    };

    return Welcome;
  }()) || _class);

  var UpperValueConverter = exports.UpperValueConverter = function () {
    function UpperValueConverter() {
      _classCallCheck(this, UpperValueConverter);
    }

    UpperValueConverter.prototype.toView = function toView(value) {
      return value && value.toUpperCase();
    };

    return UpperValueConverter;
  }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('user/login',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-event-aggregator', 'common/shooting-log-store'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaEventAggregator, _shootingLogStore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _shootingLogStore2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Login(router, _dl, _eventAggregator) {
      _classCallCheck(this, Login);

      this.errorMessage = null;
      this.user = {
        email: '',
        password: ''
      };

      this.appRouter = router;
      this.store = _dl;
      this.eventAggregator = _eventAggregator;
    }

    Login.prototype.loginUser = function loginUser() {
      var self = this;
      self.errorMessage = null;
      this.store.authenticateUser(this.user.email, this.user.password).then(function (user) {
        if (user) {
          self.eventAggregator.publish('login.success', true);
          self.appRouter.navigateToRoute('home');
        }
      }).catch(function (error) {
        self.errorMessage = error;
      });
    };

    return Login;
  }()) || _class);
});
define('user/profile',['exports', 'aurelia-framework', 'aurelia-router', 'common/shooting-log-store', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaRouter, _shootingLogStore, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BlobToUrlValueConverter = exports.Profile = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _shootingLogStore2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Profile(router, shootingLogStore, eventAggregator) {
      _classCallCheck(this, Profile);

      this.appRouter = router;
      this.store = shootingLogStore;
      this.dispatcher = eventAggregator;
    }

    Profile.prototype.activate = function activate() {
      this.dispatcher.publish('viewActivate');
    };

    Profile.prototype.saveProfile = function saveProfile() {
      this.dispatcher.publish('scorecard.changed');
    };

    Profile.prototype.embedFile = function embedFile() {
      var self = this;
      if (this.file) {
        var reader = new FileReader();
        reader.onload = function (theFile) {
          return function (e) {
            self.store.user.image = e.target.result;
          };
        }(this.file[0]);
        reader.readAsDataURL(this.file[0]);
      }
    };

    return Profile;
  }()) || _class);

  var BlobToUrlValueConverter = exports.BlobToUrlValueConverter = function () {
    function BlobToUrlValueConverter() {
      _classCallCheck(this, BlobToUrlValueConverter);
    }

    BlobToUrlValueConverter.prototype.toView = function toView(blob) {
      if (blob) return window.URL.createObjectURL(blob[0]);
    };

    return BlobToUrlValueConverter;
  }();
});
define('user/register',['exports', 'aurelia-framework', 'aurelia-router', 'common/shooting-log-store'], function (exports, _aureliaFramework, _aureliaRouter, _shootingLogStore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _shootingLogStore2.default), _dec(_class = function () {
    function Login(router, _dl) {
      _classCallCheck(this, Login);

      this.errorMessage = null;
      this.user = {
        email: '',
        password: '',
        confpassword: ''
      };

      this.appRouter = router;
      this.dataLayer = _dl;
    }

    Login.prototype.register = function register() {
      if (this.user.password == this.user.confpassword) {
        var self = this;
        self.errorMessage = null;
        this.dataLayer.register(this.user.email, this.user.password).then(function (usr) {
          if (usr) {
            self.dataLayer.initUserScorecard(usr).then(function (res) {
              self.appRouter.navigateToRoute('login');
            }, function (err) {
              self.errorMessage = "ERROR: " + err;
            });
          }
        }).catch(function (error) {
          self.errorMessage = 'ERROR: ' + error;
        });
      } else {
        this.message = 'ERROR: Passwords do not match';
      }
    };

    return Login;
  }()) || _class);
});
define('resources/elements/nav-bar',['exports', 'aurelia-framework', 'common/shooting-log-store'], function (exports, _aureliaFramework, _shootingLogStore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NavBar = undefined;

  var _shootingLogStore2 = _interopRequireDefault(_shootingLogStore);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var NavBar = exports.NavBar = (_dec = (0, _aureliaFramework.inject)(_shootingLogStore2.default), _dec(_class = (_class2 = function () {
    function NavBar(store) {
      _classCallCheck(this, NavBar);

      _initDefineProp(this, 'router', _descriptor, this);

      this.store = store;
    }

    NavBar.prototype.logout = function logout() {
      sessionStorage.clear();
      this.store.user = null;
      this.store.authToken = null;
      this.router.navigateToRoute('login');
    };

    _createClass(NavBar, [{
      key: 'isAuthenticated',
      get: function get() {
        var auth = JSON.parse(sessionStorage.getItem('auth-token'));
        return auth !== null;
      }
    }]);

    return NavBar;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'router', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
});
define('resources/value-converters/dateFormatValueConverter',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DateFormatValueConverter = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
    function DateFormatValueConverter() {
      _classCallCheck(this, DateFormatValueConverter);
    }

    DateFormatValueConverter.prototype.toView = function toView(value, format) {
      return (0, _moment2.default)(value).format(format);
    };

    DateFormatValueConverter.prototype.fromView = function fromView(str, format) {
      return (0, _moment2.default)(str, format);
    };

    return DateFormatValueConverter;
  }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"resources/elements/nav-bar\"></require>\n  <link rel=\"stylesheet\" href=\"node_modules/bootstrap/dist/css/bootstrap.css\">\n\n  <nav-bar router.bind=\"router\"></nav-bar>\n\n  <div class=\"page-host\">\n    <router-view></router-view>\n  </div>\n\n  <footer class=\"container-fluid\">\n    <hr />\n    <div class=\"row\">\n      <div class=\"col-sm-6 col-md-6 text-left\"><span show.bind=\"store.user\">Logged In As: ${store.user.email}</span></div>\n      <div class=\"col-sm-6 col-md-6 text-right\"><span class=\"hidden-xs\">MyShootingLog by <a href=\"mailto:timothy.dewees@gmail.com\">Timothy DeWees</a></span></div>\n    </div>\n  </footer>\n\n</template>\n"; });
define('text!welcome.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"au-animate container-fluid\">\n    <div class=\"page-header\">\n      <h2>${heading}</h2>\n    </div>\n    <div class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"box\">\n          <h3>Dashboard:</h3>\n          <div class=\"col-md-3\">\n            <div class=\"panel panel-default\">\n              <div class=\"panel-heading\">Last Round</div>\n              <div class=\"panel-body\">\n                <dl>\n                  <dt>Score</dt>\n                  <dd></dd>\n                  <dt>Ends</dt>\n                  <dd></dd>\n                </dl>\n              </div>\n              <div class=\"panel-footer\">details...</div>\n            </div>\n          </div>\n          <div class=\"col-md-3\">\n            <div class=\"panel panel-default\">\n              <div class=\"panel-heading\">30 Day Stats (over ${last30Stats.count} rounds)</div>\n              <div class=\"panel-body\">\n                <dl>\n                  <dt>Avg Score</dt>\n                  <dd>${last30Stats.averageRound}</dd>\n                  <dt>High Score</dt>\n                  <dd>${last30Stats.highRound}</dd>\n                  <dt>Low Score</dt>\n                  <dd>${last30Stats.lowRound}</dd>\n                </dl>\n              </div>\n              <div class=\"panel-footer\">details...</div>\n            </div>\n          </div>\n          <div class=\"col-md-3\">\n            <div class=\"panel panel-default\">\n              <div class=\"panel-heading\">Lifetime Stats (over ${lifetimeStats.count} rounds)</div>\n              <div class=\"panel-body\">\n                <dl>\n                  <dt>Avg Score</dt>\n                  <dd>${lifetimeStats.averageRound}</dd>\n                  <dt>High Score</dt>\n                  <dd>${lifetimeStats.highRound}</dd>\n                  <dt>Low Score</dt>\n                  <dd>${lifetimeStats.lowRound}</dd>\n                </dl>\n              </div>\n              <div class=\"panel-footer\">details...</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n</template>\n"; });
define('text!bow/bow.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"au-animate container-fluid\">\n    <h2>${heading}</h2>\n    <form class=\"form-horizontal\" role=\"form\" submit.delegate=\"save()\">\n      <div class=\"form-group\">\n        <label for=\"name\">Name</label>\n        <input type=\"text\" value.bind=\"bow.name\" class=\"form-control\" id=\"name\" placeholder=\"\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"type\">Type</label>\n        <select id=\"type\" value.bind=\"bow.bow_type\" class=\"form-control\">\n          <option repeat.for=\"btype of bowTypes\" value.bind=\"btype.id\">${btype.name}</option>\n        </select>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"make\">Make</label>\n        <input type=\"text\" value.bind=\"bow.make\" class=\"form-control\" id=\"make\" placeholder=\"\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"model\">Model</label>\n        <input type=\"text\" value.bind=\"bow.model\" class=\"form-control\" id=\"model\" placeholder=\"\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"poundage\">Poundage</label>\n        <input type=\"number\" value.bind=\"bow.poundage\" class=\"form-control\" id=\"poundage\" placeholder=\"\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"amoLength\">AMO Length</label>\n        <input type=\"number\" value.bind=\"bow.amo_length\" class=\"form-control\" id=\"amoLength\" placeholder=\"\">\n      </div>\n      <div class=\"form-group\">\n        <label for=\"braceHeight\">Brace Height</label>\n        <input type=\"number\" value.bind=\"bow.brace_height\" class=\"form-control\" id=\"braceHeight\" placeholder=\"\">\n      </div>\n      <button type=\"submit\" class=\"btn btn-default\">Save</button>\n    </form>\n  </section>\n</template>\n"; });
define('text!bow/bow_list.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"au-animate container-fluid\">\n    <div class=\"page-header\">\n      <h2>${heading}&nbsp;\n        <button class=\"fa fa-plus\" click.delegate=\"newBow()\">\n          <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> New Bow\n        </button>\n      </h2>\n    </div>\n    <div class=\"container-fluid\">\n      <div class=\"row hidden-xs\">\n        <div class=\"col-md-2 col-sm-2\"></div>\n        <div class=\"col-md-3 col-sm-3\"><strong>Name</strong></div>\n        <div class=\"col-md-1 col-sm-2\"><strong>Type</strong></div>\n        <div class=\"col-md-1 col-sm-1\"><strong>Make</strong></div>\n        <div class=\"col-md-1 col-sm-2\"><strong>Model</strong></div>\n        <div class=\"col-md-1 col-sm-1\"><strong>Poundage</strong></div>\n      </div>\n      <div class=\"row ${ $even ? 'even' :''}\" repeat.for=\"bow of bows\">\n        <div class=\"col-md-2 col-sm-2\">\n          <button click.delegate=\"$parent.editBow(bow)\"><span class=\"glyphicon glyphicon-pencil\"></span></button>\n          <button click.delegate=\"$parent.deleteBow(bow)\"><span class=\"glyphicon glyphicon-trash\"></span></button>\n        </div>\n        <div class=\"col-md-3 col-sm-3\"><strong class=\"visible-xs\">Name</strong>${bow.name}</div>\n        <div class=\"col-md-1 col-sm-2\"><strong class=\"visible-xs\">Type</strong>${bow.bow_type_name}</div>\n        <div class=\"col-md-1 col-sm-1\"><strong class=\"visible-xs\">Make</strong>${bow.make}</div>\n        <div class=\"col-md-1 col-sm-2\"><strong class=\"visible-xs\">Model</strong>${bow.model}</div>\n        <div class=\"col-md-1 col-sm-1\"><strong class=\"visible-xs\">Poundage</strong>${bow.poundage}</div>\n      </div>\n    </div>\n  </section>\n</template>\n"; });
define('text!round/round.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../resources/value-converters/dateFormatValueConverter\"></require>\n  <section class=\"au-animate container-fluid\">\n    <form class=\"form-horizontal\" role=\"form\" submit.delegate=\"save()\">\n      <fieldset>\n        <legend>${heading}</legend>\n        <div class=\"form-group\">\n          <label for=\"recordedDate\">Round Date</label>\n          <input type=\"date\" message=\"roundDate.send\" value.bind=\"round.recordedDate | dateFormat: 'YYYY-MM-DD'\" class=\"form-control\" id=\"recordedDate\" placeholder=\"\" required />\n        </div>\n        <div class=\"form-group\">\n          <label for=\"type\">Round Type</label>\n          <select id=\"type\" class=\"form-control\" value.bind=\"round.roundType\" required>\n            <option repeat.for=\"type of roundTypes\" model.bind=\"type\">${type}</option>\n          </select>\n        </div>\n        <div class=\"form-group\">\n          <label for=\"bow\">Bow</label>\n          <select id=\"bow\" class=\"form-control\" value.bind=\"round.bowName\" required>\n            <option repeat.for=\"bow of store.scorecard.bows\" model.bind=\"bow.name\">${bow.name}</option>\n          </select>\n        </div>\n        <div class=\"form-group\">\n          <label for=\"notes\">Notes</label>\n          <textarea id=\"notes\" class=\"form-control\" value.bind=\"round.notes\" rows=\"7\" cols=\"50\"></textarea>\n        </div>\n        <div class=\"form-group\">\n          <label for=\"score\">Round Score</label>\n          <input type=\"number\" value.bind=\"round.score\" class=\"form-control\" id=\"score\" placeholder=\"\" />\n        </div>\n        <div class=\"form-group\">\n          <div class=\"row\">\n            <div class=\"col-md-2 col-sm-2\"><strong>Add New End:</strong></div>\n            <div class=\"col-md-3 col-sm-4\"><input type=\"number\" value.bind=\"newEndScore\" placeholder=\"End Score\" /><button click.delegate=\"addEnd()\"><span class=\"glyphicon glyphicon-plus\"></span></button></div>\n          </div>\n          <div class=\"row hidden-xs\">\n            <div class=\"col-md-1 col-sm-1\"></div>\n            <div class=\"col-md-1 col-sm-1\"><strong>End#</strong></div>\n            <div class=\"col-md-2 col-sm-3\"><strong>Score</strong></div>\n          </div>\n          <div class=\"row\" repeat.for=\"end of round.ends\">\n            <div class=\"col-md-1 col-sm-1\">\n              <button click.delegate=\"$parent.deleteEnd(end)\">\n                <span class=\"glyphicon glyphicon-trash\"></span>\n              </button>\n            </div>\n            <div class=\"col-md-1 col-sm-1\"><strong class=\"visible-xs\">End#</strong>${end.number}</div>\n            <div class=\"col-md-2 col-sm-2\"><strong class=\"visible-xs\">Score</strong><input type=\"number\" value.bind=\"end.score\" change.delegate=\"$parent.endChanged()\" class=\"form-control\" id=\"end_${end.number}\" /></div>\n          </div>\n        </div>\n        <button type=\"submit\" class=\"btn btn-default\">Save</button>\n      </fieldset>\n    </form>\n  </section>\n</template>\n"; });
define('text!round/scorecard.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../resources/value-converters/dateFormatValueConverter\"></require>\n  <section class=\"au-animate container-fluid\">\n    <div class=\"page-header\">\n      <h2>${heading}&nbsp;\n        <button click.delegate=\"newRound()\">\n          <span class=\"glyphicon glyphicon-screenshot\" aria-hidden=\"true\"></span> New Round\n        </button>\n      </h2>\n    </div>\n    <p class=\"bg-danger\" show.bind=\"errorMessage\" >${errorMessage}</p>\n    <div class=\"container-fluid\">\n      <div class=\"row hidden-xs\">\n        <div class=\"col-md-2 col-sm-2\"></div>\n        <div class=\"col-md-2 col-sm-2\"><strong>Date</strong></div>\n        <div class=\"col-md-2 col-sm-2\"><strong>Type</strong></div>\n        <div class=\"col-md-2 col-sm-2\"><strong>Bow</strong></div>\n        <div class=\"col-md-1 col-sm-1\"><strong>Score</strong></div>\n        <div class=\"col-md-1 col-sm-1\"><strong>Ends</strong></div>\n      </div>\n      <div class=\"row ${ $even ? 'even' :''}\" repeat.for=\"round of dataLayer.scorecard.rounds\">\n        <div class=\"col-md-2 col-sm-2\">\n          <button click.delegate=\"$parent.editRound(round)\"><span class=\"glyphicon glyphicon-pencil\"></span></button>\n          <button click.delegate=\"$parent.deleteRound(round)\"><span class=\"glyphicon glyphicon-trash\"></span></button>\n        </div>\n        <div class=\"col-md-2 col-sm-2\"><strong class=\"visible-xs\">Date</strong>${round.recordedDate | dateFormat: 'YYYY-MM-DD'}</div>\n        <div class=\"col-md-2 col-sm-2\"><strong class=\"visible-xs\">Type</strong>${round.roundType}</div>\n        <div class=\"col-md-2 col-sm-2\"><strong class=\"visible-xs\">Bow</strong>${round.bowName}</div>\n        <div class=\"col-md-1 col-sm-1\"><strong class=\"visible-xs\">Score</strong>${round.score}</div>\n        <div class=\"col-md-1 col-sm-1\"><strong class=\"visible-xs\">Ends</strong>${round.ends.length}</div>\n      </div>\n    </div>\n  </section>\n</template>\n"; });
define('text!user/login.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"box\">\n                <div class=\"col-lg-12\">\n                    <div class=\"jumbotron\">\n                        <h1>My Shooting Log</h1>\n                        <p>Login to your account below or create an account and join the family <a route-href=\"route: register\" class=\"btn btn-primary btn-md\">register</a></p>\n                    </div>\n                    <form id=\"loginForm\">\n                        <div class=\"col-md-3\">\n                            <div class=\"panel panel-default\">\n                                <div class=\"panel-heading\">Please login</div>\n                                <div class=\"panel-body\">\n                                    <fieldset class=\"form-group\">\n                                        <label for=\"email\">Email:</label>\n                                        <input type=\"text\" class=\"form-control\" id=\"email\" value.bind=\"user.email\" />\n                                    </fieldset>\n                                    <fieldset class=\"form-group\">\n                                        <label for=\"password\">Password:</label>\n                                        <input type=\"password\" class=\"form-control\" id=\"password\" value.bind=\"user.password\" />\n                                    </fieldset>\n                                    <p class=\"bg-danger\" show.bind=\"errorMessage\" >${errorMessage}</p>\n                                </div>\n                                <div class=\"panel-footer\">\n                                    <button type=\"submit\" class=\"btn btn-primary\" click.delegate=\"loginUser()\">Login</button>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"col-md-9\">\n                            <img src=\"/content/img/hero.jpg\" class=\"img-responsive img-rounded\" />\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n"; });
define('text!user/profile.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"au-animate\">\n    <div class=\"box\">\n      <div class=\"row\">\n        <div class=\"col-md-9\">Your MyShootingLog Profile\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-3\">\n          <img src.bind=\"store.user.image\" />\n          <input type=\"file\" accept=\"image/*\" files.bind=\"file\" change.delegate=\"embedFile()\">\n\n        </div>\n        <div class=\"col-md-6\">\n          <dl>\n            <dt>Login</dt>\n            <dd>${store.user.email}</dd>\n            <dt>Member Since</dt>\n            <dd>${store.user.member-since}</dd>\n            <dt>Name</dt>\n            <dd><input type=\"text\" value.bind=\"store.user.name\"></dd>\n            <dt>Location</dt>\n            <dd><input type=\"text\" value.bind=\"store.user.location\"></dd>\n            <dt>Most used bows:</dt>\n            <dd></dd>\n            <dt>Highest Lifetime Round Score:</dt>\n            <dd></dd>\n          </dl>\n          <button click.delegate=\"saveProfile()\">Save</button>\n        </div>\n      </div>\n    </div>\n  </section>\n</template>\n"; });
define('text!user/register.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"box\">\n                <div class=\"col-lg-12\">\n                  <div class=\"page-header\">\n                    <h3>Welcome, please enter your email and password to create your account</h3>\n                  </div>\n                    <form id=\"registrationForm\">\n                        <div class=\"col-md-3\">\n                            <div class=\"panel panel-default\">\n                                <div class=\"panel-heading\">User Information</div>\n                                <div class=\"panel-body\">\n                                    <fieldset class=\"form-group\">\n                                        <label for=\"email\">Email:</label>\n                                        <input type=\"text\" class=\"form-control\" id=\"email\" value.bind=\"user.email\" />\n                                    </fieldset>\n                                    <fieldset class=\"form-group\">\n                                        <label for=\"password\">Password:</label>\n                                        <input type=\"password\" class=\"form-control\" id=\"password\" value.bind=\"user.password\" />\n                                    </fieldset>\n                                    <fieldset class=\"form-group\">\n                                        <label for=\"confpassword\">Confirm password:</label>\n                                        <input type=\"password\" class=\"form-control\" id=\"confpassword\" value.bind=\"user.confpassword\" />\n                                    </fieldset>\n                                    <p class=\"bg-danger\" show.bind=\"errorMessage\" >${errorMessage}</p>\n                                </div>\n                                <div class=\"panel-footer\">\n                                    <button type=\"submit\" class=\"btn btn-primary\" click.delegate=\"register()\">Register</button>\n                                </div>\n                            </div>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n"; });
define('text!resources/elements/nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav class=\"navbar navbar-default\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n        <span class=\"sr-only\">Toggle Navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">\n        <span class=\"glyphicon glyphicon-home\" aria-hidden=\"true\"></span> ${router.title}\n      </a>\n    </div>\n\n    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n      <ul class=\"nav navbar-nav\">\n        <li if.bind=\"isAuthenticated\" repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1.in\" href.bind=\"row.href\">${row.title}</a>\n        </li>\n      </ul>\n\n      <ul if.bind=\"!isAuthenticated\" class=\"nav navbar-nav navbar-right\">\n        <li><a href=\"/#/login\">Login</a></li>\n        <li><a href=\"/#/register\">Signup</a></li>\n      </ul>\n\n      <ul if.bind=\"isAuthenticated\" class=\"nav navbar-nav navbar-right\">\n        <li><a href=\"#\" click.delegate=\"logout()\">Logout</a></li>\n      </ul>\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"loader\" if.bind=\"router.isNavigating\">\n          <i class=\"fa fa-spinner fa-spin fa-2x\"></i>\n        </li>\n      </ul>\n    </div>\n  </nav>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map