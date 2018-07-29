(function() {
  'use strict';

  angular
    .module('angular')
    .directive('sbcropper', imageCropper);

  function imageCropper() {
    var directive = {
      restrict: 'E',
      scope: {
        src: '=',
        ngModel: '='
      },
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, element, attrs) {
      if(!scope.src) { return; }

      var c = new Croppie(element[0], {
        viewport: {
          width: 233,
          height: 140
        },
        update: function () {
          c.result('canvas').then(function(img) {
            scope.$apply(function () {
              scope.ngModel = img;
            });
          });
        }
      });
        // bind an image to croppie
      c.bind({
        url: scope.src
      });
    }
  }

})();
