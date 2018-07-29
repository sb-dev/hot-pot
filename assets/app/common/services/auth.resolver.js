(function() {
  'use strict';

  angular
    .module('angular')
    .factory('AuthResolver', ['$q', '$rootScope', '$state', '$log', AuthResolver]);

  /** @ngInject */
  function AuthResolver($q, $rootScope, $state, $log) {
    return {
      resolve: function () {
        var deferred = $q.defer();
        var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
          $log.log('currentUser', currentUser);
          if (angular.isDefined(currentUser)) {
            if (currentUser) {
              deferred.resolve(currentUser);
            } else {
              deferred.reject();
              $state.go('main.home');
            }
            unwatch();
          }
        });
        return deferred.promise;
      }
    };
  }
})();
