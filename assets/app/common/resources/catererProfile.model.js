(function() {
  'use strict';

  angular
    .module('angular')
    .factory('CatererProfile', CatererProfileModel);

  /** @ngInject */
  function CatererProfileModel() {

    /**
     * Constructor, with class name
     */
    function CatererProfile(name, phoneNumber, postcode, street) {
      this.name = name;
      this.phoneNumber = phoneNumber;
      this.postcode = postcode;
      this.street = street;
    }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    CatererProfile.build = function (data) {

      console.log('CatererProfile', data);

      if (typeof data.phoneNumber == 'undefined') {
        return new CatererProfile(
          null,
          null,
          null
        );
      }

      return new CatererProfile(
        data.name,
        data.phoneNumber,
        data.postcode,
        data.street
      );
    };

    /**
     * Return the constructor function
     */
    return CatererProfile;
  }
})();
