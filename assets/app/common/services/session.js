(function() {
  'use strict';

  angular
    .module('angular')
    .service('Session', ['$log', '$rootScope', 'USER_ROLES', 'AUTH_EVENTS', 'User', Session]);

  /** @ngInject */
  function Session($log, $rootScope, USER_ROLES, AUTH_EVENTS, User) {
    var self = this;
    var observerCallbacks = [];

    this.create = function (user) {
      self.userId = user.uid;
      switch(user.role) {
        case USER_ROLES.user:
          self.currentUser = User.build(user);
          self.currentCaterer = null;
          break;
        case USER_ROLES.caterer:
          self.currentUser = User.build(user);
          self.currentCaterer = self.currentUser.caterer;
          break;
        default:
          self.currentUser = null;
          self.currentCaterer = null;
      }
      self.userRole = user.role;
      $log.debug('create Session', self);
      notifyObservers();
    };

    this.destroy = function () {
      self.userId = null;
      self.currentUser = null;
      self.userRole = 'guest';
    };

    this.updateState = function (state, stateParams) {
      self.state = state;
      self.state.params = stateParams;
    };

    this.saveState = function (stateName, redirect) {
      var sesssion = {
        state: stateName,
        redirect: redirect
      };
      localStorageService.set('session', sesssion);
    };

    this.onLogin = function (event, user) {
      //self.create(user);
      notifyObservers();
    };

    this.onLogout = function () {
      self.destroy();
      notifyObservers();
    };

    $rootScope.$on(AUTH_EVENTS.loginSuccess, this.onLogin);
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, this.onLogout);

    this.registerObserverCallback = function(callback){
      observerCallbacks.push(callback);
    };

    var notifyObservers = function(){
      angular.forEach(observerCallbacks, function(callback){
        callback();
      });
    };
  }
})();
