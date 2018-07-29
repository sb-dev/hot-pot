(function() {
  'use strict';

  angular
    .module('angular')
    .directive('form', form);

    function form() {
      var directive = {
        require: 'form',
        restrict: 'E',
        link: linkFunc
      };

      return directive;

      function linkFunc ( scope , element , attributes ){
        var $element = $(element);
        $element.on('submit', function(e) {
          $element.find('.ng-pristine').removeClass('ng-pristine').addClass('ng-dirty');

          var form = scope[ attributes.name ];
          angular.forEach(
            form ,
            function ( formElement , fieldName ) {
              if ( fieldName[0] === '$' ) return;
              formElement.$pristine = false;
              formElement.$dirty = true;
            },
            this
          );

          //form.$setDirty();
          scope.$apply();
        });
      }
    }

})();
