// CatererService.js

var Promise = require("bluebird");

module.exports = {
  findCaterer: function(options) {
    return new Promise( function( resolve, reject ) {
      Caterer.findOne({id: options.id}).populateAll().then(function (caterer) {
        if (caterer.orders.length > 0) {
          var counter = 0;
          caterer.orders.forEach(function (item, index) {
            var userId = item.user;
            User.findOne({id: userId}).then(function (user) {
              item.user = user;
              counter++;
              if (counter == caterer.orders.length) {
                callback();
              }
            });

          });
          var callback = function() {
            return resolve(caterer);
          };
        } else {
          return resolve(caterer);
        }
      });
    });
  }
};
