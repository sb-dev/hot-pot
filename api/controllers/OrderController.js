/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var braintree = require('braintree'),
     moment = require('moment');

 var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "dpvj95ys5shhgzqt",
  publicKey: "5dvm87k6fqfvt3cy",
  privateKey: "33cdb2c23cce19ea87caf21dca2b0c27"
});

module.exports = {
	initOrder: function(req, res) {
		if ( !req.isAuthenticated() ) return res.forbidden();

		var user = req.user;
		if(user.customerId == "") {
			gateway.customer.create({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email
			}, function (err, result) {
				if (err || !response || !response.success) {
					return res.send(err);
				} else {
					user.customerId = result.customer.id;
					user.save();
				}
			});
		}

		res.send(user);
	},

	createOrder: function(req, res) {
		if ( !req.isAuthenticated() ) return res.forbidden();

		var user = req.user;
    if(req.param('paymentMethodUid')){
      PaymentMethod.findOne({uid:req.param('paymentMethodUid')}).then(function(paymentMethod){
        var result = OrderService.create({req: req, paymentMethodToken: paymentMethod.token}).then(function(result){
          return res.send(result);
        });
      });
    } else {
      gateway.paymentMethod.create({
        customerId: user.customerId,
        paymentMethodNonce: req.param('nonce')
      }, function (err, result) {
        if(result.success) {
          var result = OrderService.create({req: req, paymentMethodToken: result.paymentMethod.token}).then(function(result){
            return res.send(result);
          });
        } else {
          return res.send(result);
        }
      });
    }
	},

  updateOrder: function(req, res) {
    if ( !req.isAuthenticated() ) return res.forbidden();

    Order.findOne({uid:req.param('orderUid')}).populateAll().then(function(order){

      if(order.status === 'order-pending') {
        gateway.transaction.sale({
          amount: order.total,
          paymentMethodToken: order.paymentMethodToken,
          options: {
            submitForSettlement: true
          }
        }, function (err, transactionResult) {

          var result = {
            success: false
          };

          if(transactionResult.success) {
            order.status = 'order-accepted';
            order.preparationTime = req.param('preparationTime');
            order.acceptedAt = moment().isDST() ? moment().add(1, 'hours').unix() : moment().unix();

            if(order.savePaymentMethod) {
              var user = order.user;
              gateway.paymentMethod.find(order.paymentMethodToken, function (err, paymentMethodDetails) {

                var findCriteria = {
                  uniqueNumberIdentifier: paymentMethodDetails.uniqueNumberIdentifier
                };

                PaymentMethod.findOne(findCriteria).then(function(paymentMethod){
                  if(!paymentMethod) {
                    var recordToCreate = {
                      token: paymentMethodDetails.token,
                      uniqueNumberIdentifier: paymentMethodDetails.uniqueNumberIdentifier
                    };

                    PaymentMethod.create(recordToCreate, function userCreated(err, newPaymentMethod) {
                      if (err) {
                        console.log("err: ", err);
                      }

                      user.paymentMethods.add(newPaymentMethod);
                      user.save();
                    });
                  }
                });

              });
            }

            order.save();

            Order.publishUpdate(order.id, {status: 'order-accepted'});

            result = {
              success: true,
              acceptedAt: order.acceptedAt,
              preparationTime: order.preparationTime,
              status: order.status,
              transactionResult: transactionResult
            };
          }

          return res.send(result);
        });
      } else if (order.status === 'order-accepted') {
        order.status = 'order-ready';
        order.save();
        Order.publishUpdate( order.id, {status: 'order-ready'} );

        var result = {
          success: true,
          status: order.status,
        };

        return res.send(result);
      } else if (order.status === 'order-ready') {
        order.status = 'order-completed';
        order.save();
        Order.publishUpdate( order.id, {status: 'order-completed'} );

        var result = {
          success: true,
          status: order.status,
        };

        return res.send(result);
      }
    });

  },

	generateClientToken: function(req, res) {
		if ( !req.isAuthenticated() ) return res.forbidden();

		gateway.clientToken.generate({}, function (err, response) {
	    if (err || !response || !response.clientToken) {
        console.error(err);
        res.send(err);
	    } else {
	      var clientToken = response.clientToken;

				var user = req.user;
				if(user.customerId == "") {
					gateway.customer.create({
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email
					}, function (err, result) {
						if (err || !response || !response.success) {
							console.error(err);
							return res.send(err);
						} else {
							user.customerId = result.customer.id;
							user.save();
						}
					});
				}
	      return res.send(clientToken);
	    }
	  });
	},

  findOrder: function(req, res) {
    var counter = 0;
    Order.findOne({uid:req.param('orderUid')}).populateAll().then(function(order){

      order.items.forEach(function(item,index){
        Dish.findOne({uid:item.dishUid}).then(function(dish){
          item.dish = dish;

          counter++;
          if(counter == order.items.length){
            callback();
          }
        });
      });

      function callback(){
        return res.send(order);
      }
    });
  },

	trackOrder: function(req, res) {
		if (!req.isSocket) return res.badRequest();

    Order.findOne({uid:req.param('orderUid')}).then(function(order){
      Order.subscribe(req, order.id);
    });


		return res.ok();
	}
};
