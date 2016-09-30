import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import DataLayer from 'common/shooting-log-store';

@inject(Router, DataLayer)
export class Login {
  
  errorMessage = null;
  user = {
      email: '',
      password: '',
      confpassword: ''
  }
  
  constructor(router, _dl){
    this.appRouter = router;
    this.dataLayer = _dl;
  }
  
  register() {
    if(this.user.password == this.user.confpassword) {
        var self = this;
        self.errorMessage = null;
        this.dataLayer.register(this.user.email, this.user.password)
          .then(usr => {
            if(usr) {
              self.dataLayer.initUserScorecard(usr).then(function(res){
                self.appRouter.navigateToRoute('login')
              }, function(err) {
                self.errorMessage = "ERROR: " + err;
              });
            }  
        }).catch(error => {
          self.errorMessage = 'ERROR: ' + error;
        });    
    } else {
      this.message = 'ERROR: Passwords do not match';
    }
  }
}
