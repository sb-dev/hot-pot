(function() {
  'use strict';

  angular
    .module('angular')
    .config(['localStorageServiceProvider', config]);

  /** @ngInject */
  function config(localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('hotPot')
      .setStorageType('localStorage')
      .setNotify(true, true);
  }

})();
