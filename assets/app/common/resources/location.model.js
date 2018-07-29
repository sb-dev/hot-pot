(function() {
  'use strict';

  angular
    .module('angular')
    .factory('Location', LocationModel);

  /** @ngInject */
  function LocationModel() {

    /**
     * Constructor, with class name
     */
     function Location(latitude, longitude) {
       this.latitude = latitude;
       this.longitude = longitude;
     }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    Location.build = function (data) {

      if (typeof data.longitude == 'undefined') {
        return new Location(
          null,
          null
        );
      }

      return new Location(
        data.latitude,
        data.longitude
      );
    };

    /**
     * Return the constructor function
     */
    return Location;
  }
})();
