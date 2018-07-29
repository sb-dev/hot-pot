/**
 * CatererController
 *
 * @description :: Server-side logic for managing caterers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt'),
		fs = require('fs'),
		uuid = require('uuid');

module.exports = {
	signup: function(req, res) {
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.param('password'), salt);

    var errorMessage = "Sorry, an error has occured. Please try again later";

		User.create({
			firstName: req.param('firstName'),
			lastName: req.param('lastName'),
			email: req.param('email'),
			password: hash,
			role: 'caterer'
		}, function userCreated(err, newUser) {
			if (err) {
        if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
          && err.invalidAttributes.email[0].rule === 'unique') {
          errorMessage = 'Email already in use.';
        }

        return res.send({
          success: false,
          message: errorMessage,
          error: err
        });

			}

			Caterer.create({}, function catererCreated(err, newCaterer){

				if (err) {

					// Otherwise, send back something reasonable as our error response.
          return res.send({
            success: false,
            message: errorMessage,
            error: err
          });

				}

				User.update(newUser.id, { caterer: newCaterer }).exec(function(err, updatedUser) {

					// Send back the id of the new user
					req.logIn(newUser, function(err) {
            if (err) {
              sails.log.debug(err);
              return res.send({
                success: true,
                message: errorMessage,
                error: err
              });
            }

            updatedUser[0].caterer = newCaterer.toJSON();

            return res.send({
              success: true,
              user: updatedUser[0],
              token: AuthService.createToken(updatedUser[0])
            });
					});

				});

			});

		});
	},

	updateProfile: function(req, res) {
		if ( !req.isAuthenticated() ) return res.forbidden();

		User.findOne({uid:req.user.uid}).populateAll().then(function(user){
 			var caterer = user.caterer;

			var location = req.param('location');
			var profile = req.param('profile');

			Caterer.update(
				{id: caterer.id},
				{
					name: profile.name,
					phoneNumber: profile.phoneNumber,
					postcode: profile.postcode,
					street: profile.street,
					latitude: location.latitude,
					longitude: location.longitude
				}).exec(function(err, updatedCaterer) {
					return res.send({success: true});
				}
			);
		});
	},

	addDish: function(req, res) {
		var uid = req.param('uid');

		if(uid) {
			Dish.findOne({uid:uid}).then(function(dish){

				dish.name = req.param('name');
				dish.description = req.param('description');
				dish.price = req.param('price');
				dish.cuisine = req.param('cuisine');
				dish.dishType = req.param('dishType');
				dish.meal = req.param('meal');

				if(dish.picture != req.param('picture')) {
					var base64Data = req.param('picture').replace(/^data:image\/png;base64,/, '');
					var picture = "/uploads/" + uuid.v4() + ".png";
					require("fs").writeFile(process.cwd() + "/assets/" + picture, base64Data, 'base64', function(err) {
						dish.picture = picture;

            dish.save();

            return res.send(dish);
					});
				} else {

          dish.save();

          return res.send(dish);
        }
			});
		} else {
			var base64Data = req.param('picture').replace(/^data:image\/png;base64,/, '');
			var picture = "/uploads/" + uuid.v4() + ".png";
			require("fs").writeFile(process.cwd() + "/assets/" + picture, base64Data, 'base64', function(err) {
					Dish.create({
						name: req.param('name'),
						online: false,
						numberOfPortions: 0,
						picture: picture,
						description: req.param('description'),
						price: req.param('price'),
						cuisine: req.param('cuisine'),
						dishType: req.param('dishType'),
						meal: req.param('meal'),
					}, function catererCreated(err, newDish){

						if (err) {
							// Otherwise, send back something reasonable as our error response.
							return res.negotiate(err);
						}

						User.findOne({uid:req.user.uid}).populateAll().then(function(user){
							var caterer = user.caterer;
							caterer.dishes.add(newDish);
							caterer.save();
						});

						return res.send({
								dish: newDish
						});

					});
			});
		}

	},

	goOnline: function(req, res) {
		var selectedDishes = req.param('selectedDishes');

		for (var i = 0; i < selectedDishes.length; i++) {
			Dish.update(
				{uid: selectedDishes[i].uid},
				{
					online: true,
					preparationTime: selectedDishes[i].preparationTime,
					numberOfPortions: selectedDishes[i].numberOfPortions
				}).exec(function(err, updatedCaterer) {
					console.log("err: ", err);
				}
			);
		}

		User.findOne({uid:req.user.uid}).populateAll().then(function(user){
			var caterer = user.caterer;
			caterer.online = true;
			caterer.save();

			return res.send({
					caterer: caterer
			});
		});
	},

	goOffline: function(req, res) {

		User.findOne({uid:req.user.uid}).populateAll().then(function(user){

			Caterer.findOne({id:user.caterer.id}).populateAll().then(function(caterer){
				var catererDishes = caterer.dishes;

				for (var i = 0; i < catererDishes.length; i++) {
						var dish = catererDishes[i];
						if(dish.online) {
							dish.online = false;
							dish.preparationTime = 10;
							dish.numberOfPortions = 0;
							dish.save();
						}
				}

				caterer.online = false;
				caterer.save();

				return res.send({
						caterer: caterer
				});
			});

		});

	},

	trackOrders: function(req, res) {
		if (!req.isSocket) return res.badRequest();

		User.findOne({uid:req.user.uid}).populateAll().then(function(user){

			var caterer = user.caterer;
			Caterer.subscribe(req, caterer.id);

		});
	},

	currentCaterer: function(req, res) {
	  if ( !req.isAuthenticated() ) return res.forbidden();
		User.findOne({uid:req.user.uid}).populateAll().then(function(user){

			if ( typeof user.caterer === 'undefined' ) return res.forbidden();
			Caterer.findOne({id:user.caterer.id}).populateAll().then(function(caterer){
				var counter = 0;
				caterer.orders.forEach(function(item, index){

					var userId = item.user;

					User.findOne({id:userId}).then(function(user){
						item.user = user;
						counter++;
						if(counter == caterer.orders.length){
							callback();
						}
					});

				});
				function callback(){
					return res.send(caterer);
				}
			});

		});
  }
};
