(function() {
  'use strict';

  angular
    .module('angular')
    .controller(
      'CatererDishController',
      ['$state', '$scope', '$rootScope','$stateParams', '$log', '$filter', 'toastr', 'Restangular', 'FoodService', 'Caterer', CatererDishController]
    );

  /** @ngInject */
  function CatererDishController($state, $scope, $rootScope,$stateParams, $log, $filter, toastr, Restangular, FoodService, Caterer) {
    var self = this;

    $scope.form = {
      loading: false
    };

    FoodService.getAvailableCuisines().then(function(data){
      $scope.availableCuisines = data;
      $scope.cuisineElement = 'cuisine';
    });
    FoodService.getAvailableDishes().then(function(data){
      $scope.availableDishes = data;
    });
    FoodService.getAvailableMeals().then(function(data){
      $scope.availableMeals = data;
    });

    $scope.imageCropStep = 1;
    $scope.imageSrc = null;

    var dishId = $stateParams.dishId;
    function init() {
      if ($scope.currentCaterer) {
        $scope.dish = $scope.currentCaterer.findDish(dishId);

        if (typeof $scope.dish.picture !== 'undefined' && $scope.dish.picture !== null) {
          showPicture();
        } else {
          $scope.clearImage();
        }
      }
    }

    var listener = $scope.$watch('currentCaterer', function(caterer) {
      if (!angular.equals({}, caterer)) {
        init();
      }
    });

    function showPicture() {
      $scope.imageCropStep = 3;
    }

    $scope.cropImage = function() {
      $scope.imageSrc = null;
      $scope.imageCropStep = 3;
    };

    $scope.selectImage = function(e) {
        var files = e.target.files;
        if(files.length > 0) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(files[0]);
          fileReader.onload = function(e) {
              $scope.imageSrc = this.result;
              $scope.imageCropStep = 2;
              $scope.$apply();
          };
        }
    };

    $scope.clearImage = function() {
         $scope.imageCropStep = 1;
         $scope.imageSrc = null;
         angular.element(document.querySelector('#imageInput')).val(null);
    };

    $scope.$watch('dish.price', function(value) {
        if(typeof value !== 'undefined'){
          $scope.dish.price = $filter('currency')(value,'');
        }
    });

    var baseDish = Restangular.all('/caterer/dish');
    $scope.submitDishForm = function(dish) {
      console.log("dish", dish);
      if($scope.catererDishForm.$valid) {
        $scope.form.loading = true;
        var action = dish.uid == null ? "created":"updated";
        baseDish.post(dish).then(function(result) {
           console.log("createdDish", result);
           toastr.success('Dish successfully ' + action);
           if (action == "created") {
             $scope.currentCaterer.addDish(result.dish);
             $state.go('caterer.editDish', {dishId: result.dish.uid});
           }
           $scope.form.loading = false;
        }, function() {
          console.log("There was an error saving");
          $scope.form.loading = false;
        });
      }
    };

    init();
  }
})();
