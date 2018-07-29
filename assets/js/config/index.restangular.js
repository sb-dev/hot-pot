(function() {
  'use strict';

  angular
    .module('angular')
    .config(['RestangularProvider', restangularConfig]);

  /** @ngInject */
  function restangularConfig(RestangularProvider) {
    // RestangularProvider.setJsonp(true);
    // RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'result'});
    RestangularProvider.setBaseUrl('http://localhost:1337/');
  }

})();
