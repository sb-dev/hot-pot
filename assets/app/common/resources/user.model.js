(function() {
  'use strict';

  angular
    .module('angular')
    .factory('User', ['Caterer' ,UserModel]);

  /** @ngInject */
  function UserModel(Caterer) {

    /**
     * Constructor, with class name
     */
    function User() {}

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    User.build = function (data) {
      var user = new User();

      if(typeof data.email !== 'undefined') {
        user.email = data.email;
      }

      if(typeof data.mobilePhone !== 'undefined') {
        user.mobilePhone = data.mobilePhone;
      } else {
        user.mobilePhone = null;
      }

      if(typeof data.firstName !== 'undefined') {
        user.firstName = data.firstName;
      }

      if(typeof data.lastName !== 'undefined') {
        user.lastName = data.lastName;
      }

      if(typeof data.profilePicture !== 'undefined' && data.profilePicture !== null) {
        user.profilePicture = data.profilePicture;
      } else {
        user.profilePicture = false;
      }

      if(typeof data.uid !== 'undefined') {
        user.uid = data.uid;
      }

      if(typeof data.displayName !== 'undefined') {
        if (data.displayName == "") {
          user.displayName = user.firstName;
        } else {
          user.displayName = data.displayName;
        }
      }

      if(typeof data.caterer != "undefined" && data.caterer != null) {
        user.caterer = Caterer.build(data.caterer);
      }

      return user;
    };

    User.prototype.findPaymentMethod = function (paymentMethodId) {
      for(var i = 0; i<this.paymentMethods.length;i++) {
        if(this.paymentMethods[i].uid == paymentMethodId) {
          console.log('data', this.paymentMethods[i]);
          return this.paymentMethods[i];
        }
      }
      return null;
    };

    User.prototype.getFullName = function () {
      return this.firstName +" "+ this.lastName;
    };

    /**
     * Return the constructor function
     */
    return User;
  }
})();
