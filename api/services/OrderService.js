// OrderService.js

var Promise = require("bluebird");

module.exports = {

    create: function(options) {
      var req = options.req;
      var paymentMethodToken = options.paymentMethodToken;
      var user = req.user;

      return new Promise( function( resolve, reject )
      {
        var deliveryAddress = req.param('deliveryAddress');
        var items = [];
        var catererId = null;
        var total = 0;
        var counter = 0;

        req.param('items').forEach(function(item,index){
          Dish.findOne({uid:item.dish.uid}).populate('caterer').then(function(dish){
            if(catererId == null) {
              catererId = dish.caterer.id;
            }

            if(catererId == dish.caterer.id){
              var orderItem = {
                quantity: item.quantity,
                dishUid: dish.uid
              };
              total += dish.price;
              items.push(orderItem);
            }

            counter++;
            if(counter == req.param('items').length){
              callback();
            }
          });
        });

        function callback(){
          Order.create({
            status: 'order-pending',
            phoneNumber: req.param('phoneNumber'),
            notes: req.param('notes'),
            savePaymentMethod: req.param('savePaymentMethod'),
            paymentMethodToken: paymentMethodToken,
            total: total,
            items: items
          }, function userCreated(err, newOrder) {
            if (err) {
              console.log("err: ", err);
              console.log("err.invalidAttributes: ", err.invalidAttributes);
            }

            Caterer.findOne({id:catererId}).then(function(caterer){
              caterer.orders.add(newOrder);
              caterer.save();
              Caterer.publishAdd(caterer.id, 'orders', newOrder.uid);
              user.orders.add(newOrder);
              user.save();

              return resolve({
                success: true,
                orderUid: newOrder.uid
              });
            });

          });
        }
      });

    }
};
