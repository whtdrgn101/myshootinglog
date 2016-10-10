import {computedFrom, inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import Store from 'common/shooting-log-store';

@inject(Store)
export class App {

  constructor(_store) {
    this.store = _store;
    let lsStore = null;
    try { lsStore = JSON.parse(sessionStorage.store)}
    catch(e){}

    if(lsStore) {
      this.store = _.extend(this.store, lsStore);
    }
  }

  configureRouter(config, router) {
    config.title = 'My Shooting Log';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'welcome'], name: 'home',      moduleId: 'welcome',         auth: true,  nav: true,  title: 'Home', cs: this.store },
      { route: ['scorecard'],   name: 'scorecard', moduleId: 'round/scorecard', auth: true,  nav: true,  title: 'Scorecard', cs: this.store },
      { route: ['round'],       name: 'round',     moduleId: 'round/round',     auth: true,  nav: false, title: 'Round', cs: this.store },
      { route: ['bow_list'],    name: 'bow_list',  moduleId: 'bow/bow_list',    auth: true,  nav: true,  title: 'Bows', cs: this.store },
      { route: ['bow'],         name: 'bow',       moduleId: 'bow/bow',         auth: true,  nav: false, title: 'Bow Details', cs: this.store },
      { route: ['profile'],     name: 'profile',   moduleId: 'user/profile',    auth: true,  nav: true,  title: 'Profile', cs: this.store },
      { route: ['login'],       name: 'login',     moduleId: 'user/login',      auth: false, nav: false, title: 'Login', cs: this.store },
      { route: ['register'],    name: 'register',  moduleId: 'user/register',   auth: false, nav: false, title: 'Register', cs: this.store },
    ]);

    this.router = router;
  }
}

class AuthorizeStep {

  run(navigationInstruction, next) {
    // Check if the route has an "auth" key
    // The reason for using `nextInstructions` is because
    // this includes child routes.
    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      var auth = JSON.parse(sessionStorage.getItem('auth-token'));
      if(auth == null) {
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }
}
