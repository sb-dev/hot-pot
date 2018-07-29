(function() {
  'use strict';

  angular
    .module('angular')
    .controller(
      'CatererAppController',
      ['$log', '$state', '$rootScope', '$scope', '$http', 'Session', 'USER_ROLES', 'AUTH_EVENTS', 'Restangular', 'OrderService', CatererAppController]
    );

  /** @ngInject */
  function CatererAppController($log, $state, $rootScope, $scope, $http, Session, USER_ROLES, AUTH_EVENTS, Restangular, OrderService) {
    var self = this;

    $scope.form = {
      loading: false
    };

    $scope.pendingOrders = 0;
    $scope.caterer = {};

    $scope.audio = new Audio('/sounds/alert.mp3');
    var init = function() {
      if(Session.userRole === USER_ROLES.guest) {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      } else if (Session.currentCaterer) {
        io.socket.get('/caterer/track-orders');
        $scope.currentCaterer = Session.currentCaterer;
        $scope.pendingOrders = $scope.currentCaterer.countPendingOrders();

        if($scope.currentCaterer.online) {
          $scope.online = true;
        }

        $scope.availableDishes = $scope.currentCaterer.dishes;
        $log.debug('$scope.availableDishes', $scope.availableDishes);
      }
    };
    Session.registerObserverCallback(init);

    $scope.$on('header:updated', function(event,header) {
       $scope.header = header;
    });

    $scope.$on('pendingOrders:update', function(event,user) {
       $scope.pendingOrders = $scope.currentCaterer.countPendingOrders();
    });

    $scope.selectedDishes = [];
    $scope.elementName = "selectedDish";
    $rootScope.$on("selectedDish:updated", function(event,dishId) {
      var selectedDish = $scope.currentCaterer.findDish(dishId);
      selectedDish.preparationTime = 10;
      selectedDish.numberOfPortions = 1;
      selectedDish.hide = true;
      $scope.selectedDishes.push(selectedDish);
      $scope.$apply();
    });

    $scope.removeSelectedDish = function(index){
      $scope.selectedDishes[index].hide = false;
      $scope.selectedDishes.splice(index, 1);
    };

    $scope.countdown = 0;

    $scope.online = false;
    var baseOnline = Restangular.all('caterer/go-online');
    $scope.goOnline = function(selectedDishes) {
      if (selectedDishes.length > 0) {
        $scope.form.loading = true;
        //baseOnline.post({selectedDishes: selectedDishes})
        $http.post('/caterer/go-online', {selectedDishes: selectedDishes}).then(function(result) {
          console.log("go-online");
           $scope.form.loading = false;
           $scope.online = true;
           $scope.selectedDishes = [];
           $state.go('catererApp.viewOrders');
        }, function() {
          console.log("There was an error saving");
          $scope.form.loading = false;
        });
      }
    };

    var baseOffline = Restangular.all('caterer/go-offline');
    $scope.goOffline = function() {
      baseOffline.post().then(function(result) {
        $scope.online = false;
        $state.go('catererApp.go');
      }, function() {
        console.log("There was an error while going offline");
        $scope.form.loading = false;
      });
    };

    io.socket.on('caterer', function(event) {
      switch (event.verb) {
        case 'addedTo':
          var orderUid = event.addedId;
          OrderService.findOrder(orderUid).then(function(order){
            $scope.currentCaterer.addOrder(order);
            $scope.pendingOrders = $scope.currentCaterer.countPendingOrders();
            $scope.audio.play();
          });
          break;
        default:
          console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
      }
		});

    $scope.back = function() {
      $rootScope.$broadcast('go:viewOrders');
    };

    init();
  }
})();
