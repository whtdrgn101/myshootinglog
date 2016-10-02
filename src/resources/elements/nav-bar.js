import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import Store from 'common/shooting-log-store';

@inject(Store)
export class NavBar {
  // User isn't authenticated by default
  @bindable router = null;

  constructor(store) {
    this.store = store;
  }

  // We can check if the user is authenticated
  // to conditionally hide or show nav bar items
  get isAuthenticated() {
    var auth = JSON.parse(sessionStorage.getItem('auth-token'));
    return (auth !== null);
  }

  logout() {
    sessionStorage.clear();
    this.store.user = null;
    this.store.authToken = null;
    this.router.navigateToRoute('login');
  }
}
