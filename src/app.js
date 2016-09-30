import {computedFrom, inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import Store from 'common/shooting-log-store';

@inject(Store)
export class App {

  constructor(_store) {
    this.store = _store;
  }

  configureRouter(config, router) {
    config.title = 'My Shooting Log';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'welcome'], name: 'home',      moduleId: 'welcome',         auth: true,  nav: true,  title: 'Home' },
      { route: ['scorecard'],   name: 'scorecard', moduleId: 'round/scorecard', auth: true,  nav: true,  title: 'Scorecard' },
      { route: ['round'],       name: 'round',     moduleId: 'round/round',     auth: true,  nav: false, title: 'Round' },
      { route: ['bow_list'],    name: 'bow_list',  moduleId: 'bow/bow_list',    auth: true,  nav: true,  title: 'Bows' },
      { route: ['bow'],         name: 'bow',       moduleId: 'bow/bow',         auth: true,  nav: false, title: 'Bow Details' },
      { route: ['profile'],     name: 'profile',   moduleId: 'user/profile',    auth: true,  nav: true,  title: 'Profile' },
      { route: ['login'],       name: 'login',     moduleId: 'user/login',      auth: false, nav: false, title: 'Login' },
      { route: ['register'],    name: 'register',  moduleId: 'user/register',   auth: false, nav: false, title: 'Register' },
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
