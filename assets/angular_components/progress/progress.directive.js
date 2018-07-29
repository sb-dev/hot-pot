(function() {
  'use strict';

  angular
    .module('angular')
    .directive('progress', progress);

  /** @ngInject */
  function progress($log, $parse, $rootScope) {
    var directive = {
      restrict: 'A',
      compile: compileFunc
    };

    return directive;

    function compileFunc(element, attrs) {
      console.log('attrs', attrs);
      var modelAccessor = $parse(attrs.ngModel);

      return function (scope, element, attrs, controller) {
        scope.$watch(modelAccessor, function (val) {
          element.progress({
            percent: val
          });
        });
      };
    }
  }

})();
