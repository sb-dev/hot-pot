(function() {
  'use strict';

  angular
    .module('angular')
    .controller('DriverController', ['$timeout', '$scope', '$log', '$rootScope', 'NgMap', DriverController]);

  /** @ngInject */
  function DriverController($timeout, $scope, $log, $rootScope, NgMap) {
    var self = this;

    $scope.$log = $log;

    $scope.online = false;
    $scope.transitMode = false;

    $scope.incomingRequest = false;
    $scope.remainingTime = 60;

    $scope.goOnline = function() {
      $scope.online = true;
      $timeout(function() {
          $scope.incomingRequest = true;
          $scope.remainingTime = 60;
      }, 3000);

      NgMap.initMap();
    }

    $scope.goOffline = function() {
      $scope.online = false;
    }

    $scope.acceptRequest = function() {
      $scope.transitMode = true;
      $scope.incomingRequest = false;
    }

    $scope.cancelDelivery = function() {
      $scope.transitMode = false;
    }

    function cancelRequest() {
      $scope.$apply(function () {
            $scope.incomingRequest = false;
      });
    }

    $scope.$on('timer-stopped', function (event, data){
      cancelRequest();
    });

    $rootScope.wayPoints = [
      {location: {lat:51.427692, lng: -0.131241}, stopover: true},
    ];
  }
})();
