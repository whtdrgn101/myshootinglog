import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';

export class NavBar {
  // User isn't authenticated by default
  @bindable router = null;

  // We can check if the user is authenticated
  // to conditionally hide or show nav bar items
  get isAuthenticated() {
    var auth = JSON.parse(sessionStorage.getItem('auth-token'));
    return (auth !== null);
  }

  logout() {
    sessionStorage.clear();
    this.appRouter.navigateToRoute('login');
  }
}
