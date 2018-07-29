/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var turf = require('turf');

module.exports = {
	search: function(req, res) {
		var location = req.param('location');
		var point = {
		  type: 'Feature',
		  geometry: {
		    type: 'Point',
		    coordinates: [location.longitude, location.latitude]
		  },
		  properties: {}
		};

		var range = 2.50;
		var units = 'kilometers';

		var buffered = turf.buffer(point, range, units);

		var availableDishes = [];

		Caterer.find({online: true}).populateAll().exec(function (err, caterers) {

			for(var i = 0; i < caterers.length; i++) {
				var caterer = caterers[i];

				var catererPoint = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [caterer.longitude, caterer.latitude]
					},
					properties: {}
				};
				var distance = turf.distance(point, catererPoint, units);

				if(turf.inside(catererPoint, buffered.features[0])) {
					caterer.dishes.forEach(function(item,index){
						if(item.online) {
							item.distance = distance;
							item.catererName = caterer.name;
							availableDishes.push(item);
						}
					});

				}
			}

			var currentSearch = {
				service: req.param('service'),
				availableDishes: availableDishes
			};

			return res.send(currentSearch);
		});
	},

	initMenu: function(req, res) {
		var dishes = req.param('items');

    var result = {
      success: false,
      message: 'An error has occurred while creating your order, please try again.'
    };

		Dish.findOne({uid:dishes[0].dish.uid}).populate('caterer').then(function(dish){

      if(dish) {
        Caterer.findOne({id:dish.caterer.id}).populateAll().then(function(caterer){

          if(!caterer) {
            return res.send(result);
          }

          caterer.dishes = caterer.dishes.filter(function(item){
            return item.online === true;
          });

          return res.send({
            success: true,
            caterer: caterer
          });
        });
      } else {
        return res.send(result);
      }

		});
	}
};
