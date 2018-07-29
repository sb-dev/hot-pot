(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CatererAppOrdersController', ['$rootScope', CatererAppOrdersController]);

  /** @ngInject */
  function CatererAppOrdersController($rootScope) {
    var header = {
      back: false
    };
    $rootScope.$broadcast('header:updated',header);
  }
})();
