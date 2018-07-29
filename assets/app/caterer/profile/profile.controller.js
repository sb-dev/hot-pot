(function() {
  'use strict';

  angular
    .module('angular')
    .controller('CatererProfileController', ['$log', '$scope', 'toastr', 'CatererService', 'PostcodeService', CatererProfileController]);

  /** @ngInject */
  function CatererProfileController($log, $scope, toastr, CatererService, PostcodeService) {

    $scope.profile = null;
    function init() {
      if($scope.currentCaterer) {
        $scope.profile = $scope.currentCaterer.profile;
      }
    }

    var listener = $scope.$watch('currentCaterer', function(caterer) {
      if (!angular.equals({}, caterer)) {
        init();
      }
    });

    $scope.map =  {
      center: {
        latitude: 51.507351,
        longitude: -0.127758
      },
      zoom: 10
    };
    $scope.marker = false;

    var geocoder = new google.maps.Geocoder();
    $scope.$watch(
      '[profile.postcode, profile.street]',
      function (newValue, oldValue) {
        var postcode = newValue[0];
        var street = newValue[1];

        var newPostcodeValue = postcode;
        var oldPostcodeValue = oldValue[0];

        var postcodeValueChanged = false;
        if(typeof oldPostcodeValue != 'undefined' && newPostcodeValue != oldPostcodeValue) {
          postcodeValueChanged = true;
          street = "";
        }

        if (PostcodeService.validate(postcode)) {
          var address = street == "" ? postcode : street + " " + postcode;
          geocoder.geocode( { "address": address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
              var result = results[0];

              if (postcodeValueChanged) {
                    $scope.profile.street = result.address_components[1].long_name;
              }

              $scope.currentCaterer.setLocation({latitude: result.geometry.location.lat(), longitude: result.geometry.location.lng()});
              $scope.map = {
                center: $scope.currentCaterer.location,
                zoom: 18
              };

              $scope.marker = {
                id: 0,
                coords: $scope.currentCaterer.location,
                options: { draggable: true },
                events: {
                  dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');

                    var location = {
                      latitude: marker.getPosition().lat(),
                      longitude: marker.getPosition().lng()
                    };

                    $scope.currentCaterer.setLocation(location);

                    $scope.marker.options = {
                      draggable: true,
                      labelContent: "",
                      labelAnchor: "100 0",
                      labelClass: "marker-labels"
                    };
                  }
                }
              };

              $scope.$apply();
            }
          });
        }
      },
      true
    );

    $scope.form = {
      loading: false
    };

    $scope.submitCatererProfileForm = function(profile) {
      if($scope.catererProfileForm.$valid) {
        $scope.currentCaterer.profile = profile;
        $scope.form.loading = true;

        CatererService.updateProfile($scope.currentCaterer).then(function(result){
          $scope.form.loading = false;
          if(result.success) {
            toastr.success('Profile successfully updated');
          }
        });
        // baseProfile.post($scope.currentCaterer).then(function(updatedCaterer) {
        //   toastr.success('Profile successfully updated');
        //   $scope.form.loading = false;
        // }, function() {
        //   console.log("There was an error saving");
        //   $scope.form.loading = false;
        // });
      }

    };

    init();
  }
})();
