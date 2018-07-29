(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CatererController', ['$rootScope', '$scope', '$log', 'Session', 'AUTH_EVENTS', 'USER_ROLES', CatererController]);

    function CatererController($rootScope, $scope, $log, Session, AUTH_EVENTS, USER_ROLES) {

      $scope.smallSideBar = false;
      $log.debug('Session', Session);
      if(Session.userRole === USER_ROLES.guest) {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      } else {
        $scope.currentCaterer = Session.currentCaterer;
      }

      var setCurrentCaterer = function () {
        $scope.currentCaterer = Session.currentCaterer;
        $log.log('setCurrentCaterer', $scope.currentCaterer);
      };
      Session.registerObserverCallback(setCurrentCaterer);

    }

})();
