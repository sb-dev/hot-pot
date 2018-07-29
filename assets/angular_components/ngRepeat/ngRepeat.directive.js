(function() {
  'use strict';

  angular
    .module('angular')
    .directive('ngRepeatDone', ['$timeout', ngRepeatDone]);

  /** @ngInject */
  function ngRepeatDone($timeout) {
    return {
      restrict: 'A',
      link: function (scope) {
        if (scope.$last){
          $timeout(function(){
            console.log('ngRepeatDone');
            scope.$emit('ngRepeatDone');
          });
        }
      }
    };


  }

})();
