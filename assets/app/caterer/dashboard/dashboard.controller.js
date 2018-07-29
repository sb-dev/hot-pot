(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CatererDashboardController', ['$scope', CatererDashboardController]);

  /** @ngInject */
  function CatererDashboardController($scope) {
    var self = this;

    $scope.online = false;
    $scope.countdown = 1200;

    $scope.goOnline = function() {
      $scope.online = true;

      $scope.$apply(function () {
            $scope.countdown = 1200;
      });
    }
  }
})();
