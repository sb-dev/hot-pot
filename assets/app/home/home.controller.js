(function() {
  'use strict';

  angular
    .module('angular')
    .controller('HomeController', ['$rootScope', '$state', '$stateParams', 'Session', HomeController]);

  /** @ngInject */
  function HomeController($rootScope, $state, $stateParams, Session) {
    $rootScope.$broadcast('headerState:updated','home');

    Session.updateState($state.current, $stateParams);
  }
})();
