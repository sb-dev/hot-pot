(function() {
  'use strict';

  angular
    .module('angular')
    .controller(
      'AuthController',
      ['$log', '$state', 'localStorageService', 'AuthService', '$stateParams', '$timeout', 'Session', AuthController]
    );

  /** @ngInject */
  function AuthController($log, $state, localStorageService, AuthService, $stateParams, $timeout) {
    var token = $stateParams.token;
    AuthService.authenticate(false, token);

    var nextState = false;
    var session = localStorageService.get('session');
    console.log('loginWithFacebook', session);
    if(session){
      if(session.redirect) {
        session.redirect = false;
        localStorageService.set('session', session);
        nextState = session.state;

        $timeout(function() {
          $state.go(nextState.name, nextState.params);
        }, 2000);
      }
    }
  }
})();
