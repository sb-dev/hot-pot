(function() {
  'use strict';

  angular
    .module('angular')
    .directive('onError', onError);

  /** @ngInject */
  function onError() {
    return {
      restrict: 'A',
      link: linkFunc
    };

    function linkFunc(scope, element, attr) {
      element.on('error', function() {
        element.attr('src', attr.onError);
      });
    }
  }

})();
