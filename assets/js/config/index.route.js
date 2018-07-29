(function() {
  'use strict';

  angular
    .module('angular')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'USER_ROLES', routerConfig]);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES) {
    $stateProvider
      .state('authenticate', {
        url: '/authenticate/:token',
        templateUrl: 'app/main/loading.html',
        controller: 'AuthController',
        controllerAs: 'auth'
      }).state('login', {
        url: '/login',
        templateUrl: 'app/user/login.html',
        controller: 'UserController',
        controllerAs: 'user'
      }).state('register', {
        url: '/register',
        templateUrl: 'app/user/register.html',
        controller: 'UserController',
        controllerAs: 'user'
      }).state('main', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      }).state('main.home', {
        url: '/',
        templateUrl: 'app/home/main.home.html',
        controller: 'HomeController',
        controllerAs: 'home',
      }).state('main.search', {
        url: '/search?postcode&service',
        templateUrl: 'app/search/main.search.html',
        controller: 'SearchController',
        controllerAs: 'search',
      }).state('main.menu', {
        url: '/menu',
        templateUrl: 'app/menu/main.menu.html',
        controller: 'MenuController',
        controllerAs: 'menu',
      }).state('main.checkout', {
        url: '/checkout',
        templateUrl: 'app/checkout/main.checkout.html',
        controller: 'CheckoutController',
        controllerAs: 'checkout',
      }).state('main.checkout.login', {
        url: '/login',
        templateUrl: 'app/checkout/login/main.login.html',
        controller: 'CheckoutLoginController',
        controllerAs: 'checkoutLogin',
      }).state('main.checkout.details', {
        url: '/details',
        templateUrl: 'app/checkout/details/main.details.html',
        controller: 'CheckoutDetailsController',
        controllerAs: 'checkoutDetails',
      }).state('main.checkout.confirmation', {
        url: '/confirmation/:orderUid',
        templateUrl: 'app/checkout/confirmation/main.confirmation.html',
        controller: 'CheckoutConfirmationController',
        controllerAs: 'checkoutConfirmation',
      }).state('caterer', {
        url: '/caterer',
        templateUrl: 'app/caterer/caterer.html',
        controller: 'CatererController',
        controllerAs: 'caterer',
      }).state('caterer.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/caterer/dashboard/caterer.dashboard.html',
        controller: 'CatererDashboardController',
        controllerAs: 'catererDashboard',
      }).state('catererSignup', {
        url: '/caterer-signup',
        templateUrl: 'app/caterer/signup/caterer.signup.html',
        controller: 'CatererSignupController',
        controllerAs: 'catererSignup'
      }).state('caterer.profile', {
        url: '/profile',
        templateUrl: 'app/caterer/profile/caterer.profile.html',
        parent: 'caterer',
        controller: 'CatererProfileController',
        controllerAs: 'catererProfile'
      }).state('caterer.addDish', {
        url: '/add-dish',
        templateUrl: 'app/caterer/dish/caterer.dishForm.html',
        controller: 'CatererDishController',
        controllerAs: 'catererDish'
      }).state('caterer.editDish', {
        url: '/dish/:dishId',
        templateUrl: 'app/caterer/dish/caterer.dishForm.html',
        controller: 'CatererDishController',
        controllerAs: 'catererDish'
      }).state('catererApp', {
        url: '/caterer-app',
        templateUrl: 'app/caterer/app/main.html',
        controller: 'CatererAppController',
        controllerAs: 'catererApp'
      }).state('catererApp.go', {
        url: '/go-online',
        templateUrl: 'app/caterer/app/main.go-online.html',
      }).state('catererApp.viewOrders', {
        url: '/orders',
        templateUrl: 'app/caterer/app/main.orders.html',
        controller: 'CatererAppOrdersController',
        controllerAs: 'catererOrdersApp'
      }).state('catererApp.viewOrderItem', {
        url: '/order/:orderUid',
        templateUrl: 'app/caterer/app/main.orderItem.html',
        controller: 'CatererAppOrderController',
        controllerAs: 'catererOrderApp'
      }).state('driver', {
        url: '/driver',
        templateUrl: 'app/driver/driver.html',
        controller: 'DriverController',
        controllerAs: 'driver'
      }).state('driver.login', {
        url: '/login',
        templateUrl: 'app/driver/driver.login.html',
      }).state('driver.go', {
        url: '/go-online',
        templateUrl: 'app/driver/driver.go-online.html',
      });

    $urlRouterProvider.otherwise('/');
  }

})();
