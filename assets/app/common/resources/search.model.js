(function() {
  'use strict';

  angular
    .module('angular')
    .factory('Search', SearchModel);

  /** @ngInject */
  function SearchModel() {
    /**
     * Constructor, with class name
     */
    function Search(postcode, email, day, time) {
      this.postcode = postcode;
      this.deliveryMode = deliveryMode;
      this.day = day;
      this.time = time;
    }

    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    Search.build = function (data) {
      return new Search(
        data.postcode,
        data.deliveryMode,
        data.day,
        data.time
      );
    };

    /**
     * Return the constructor function
     */
    return Search;
  }
})();
