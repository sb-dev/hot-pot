(function() {
  'use strict';

  angular
    .module('angular')
    .directive('dropdowna', dropdown);

  /** @ngInject */
  function dropdown(AUTH_EVENTS) {
    var directive = {
      restrict: 'A',
      compile: compileFunc
    };

    return directive;

    function compileFunc(element) {
      // element.dropdown();
    }
  }

})();
