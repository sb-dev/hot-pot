/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var bcrypt = require('bcrypt'),
 		fs = require('fs'),
 		uuid = require('uuid'),
    braintree = require('braintree'),
    moment = require('moment');

var gateway = braintree.connect({
 environment: braintree.Environment.Sandbox,
 merchantId: "dpvj95ys5shhgzqt",
 publicKey: "5dvm87k6fqfvt3cy",
 privateKey: "33cdb2c23cce19ea87caf21dca2b0c27"
});

module.exports = {

  /**
   * Sign up for a user account.
   */
  signup: function(req, res) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.param('password'), salt);

		User.create({
			firstName: req.param('firstName'),
			lastName: req.param('lastName'),
			email: req.param('email'),
			mobilePhone: req.param('mobilePhone'),
      password: hash,
			role: 'user'
		}, function userCreated(err, newUser) {
			if (err) {

        var message = '';
				if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
					&& err.invalidAttributes.email[0].rule === 'unique') {
          message = 'Email already in use.';
				}

        if (err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0]
          && err.invalidAttributes.username[0].rule === 'unique') {
          message = 'Username already in use.';
        }

				// Otherwise, send back something reasonable as our error response.
        return res.send({
          success: false,
          message: message
        });
			}

			// Log user in
      return res.send({
        success: true,
        user: newUser,
        token: AuthService.createToken(newUser)
      });
		});
	},

  findPaymentMethods: function(req, res) {
    if ( !req.isAuthenticated() ) return res.forbidden();

    var paymentMethods = [];
    User.findOne({uid:req.user.uid}).populateAll().then(function(user){
      var counter = 0;
      user.paymentMethods.forEach(function(savedPaymentMethod, index){
        gateway.paymentMethod.find(savedPaymentMethod.token, function (err, paymentMethodDetails) {
          var paymentMethod = {
            uid: savedPaymentMethod.uid,
            cardType: paymentMethodDetails.cardType,
            expirationMonth: paymentMethodDetails.expirationMonth,
            expirationYear: paymentMethodDetails.expirationYear,
            maskedNumber: paymentMethodDetails.maskedNumber,
          };
          paymentMethods.push(paymentMethod);
          counter++;
          if(counter == user.paymentMethods.length){
            callback();
          }
        });
      });
    });

    function callback(){
      return res.send(paymentMethods);
    }
  },

  currentUser: function(req, res) {
    var user;
    if (!req.isAuthenticated()) {
      user = {
        uid: uuid.v4(),
        role: 'guest'
      };
      return res.send(user);
    } else {
      user = req.user;
      switch (req.user.role) {
        case 'caterer':
          var options = {
            id: user.caterer
          };
          CatererService.findCaterer(options).then(function(caterer){
            user.caterer = caterer.toJSON();
            return res.send(user);
          });
          break;
        case 'driver':
        default:
          return res.send(req.user);
      }

    }
  }

};
