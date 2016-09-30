import {computedFrom, inject, URL} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import ShootingLogStore from 'common/shooting-log-store';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Router, ShootingLogStore, EventAggregator)
export class Profile {

  file;

  constructor(router, shootingLogStore, eventAggregator) {
    this.appRouter = router;
    this.store = shootingLogStore;
    this.dispatcher = eventAggregator;
  }

  activate() {
    this.dispatcher.publish('viewActivate');
  }

  saveProfile() {
    this.dispatcher.publish('scorecard.changed');
  }

  embedFile() {
    var self = this;
    if(this.file) {
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          self.store.user.image = e.target.result;
        };
      })(this.file[0]);
      reader.readAsDataURL(this.file[0]);
    }

  }
}

export class BlobToUrlValueConverter {
  toView(blob) {
    if(blob)
      return window.URL.createObjectURL(blob[0]);
  }
}
