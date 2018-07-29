(function() {
  'use strict';

  angular
    .module('angular')
    .directive('combobox', ['$log', '$parse', '$rootScope', '$timeout', dropdown]);

  /** @ngInject */
  function dropdown($log, $parse, $rootScope, $timeout) {
    return {
      restrict: 'A',
      scope: {
        name: '=',
        value: "=",
        items: "="
      },
      templateUrl: '/angular_components/combobox/combobox.html',
      compile: compileFunc
    };

    function compileFunc(element, attrs) {
      return { post: function (scope, element, attrs) {
        var processChange = function (val) {
          console.log('processChange',val);

          if(scope.value != val) {
            scope.$apply(function (scope) {
                scope.value = val;
             });
          }

          $rootScope.$broadcast(scope.name + ':updated', val);
        };

        element.dropdown({
            onChange: processChange
        });

        var setValue = function () {
          console.log("compile set value", scope.value);
          element.dropdown('set selected',scope.value);
        };
        scope.$on('ngRepeatDone', setValue);

      }};
    }
  }

})();
