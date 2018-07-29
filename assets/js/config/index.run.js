(function() {
  'use strict';

  angular
    .module('angular')
    .run(['Session', '$http', '$log', runBlock]);

  /** @ngInject */
  function runBlock(Session, $http, $log) {
    // Simple GET request example:
    $http({
      method: 'GET',
      url: '/current-user'
    }).then(function successCallback(res) {
        Session.create(res.data);
    },function errorCallback(response) {
        $log.warn('run block failed', response);
        Session.destroy();
    });

    $log.debug('runBlock end');
  }

})();
