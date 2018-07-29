/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt'),
    uuid = require('uuid');

const ORDER_STATUS = ['order-canceled', 'order-failed', 'order-pending', 'order-accepted', 'order-ready', 'order-completed'];

module.exports = {

  attributes: {
    uid: {
      type: 'string',
      defaultsTo: function() {
        return uuid.v4();
      }
    },
    estimatedTime: {
      type: 'string',
    },
    preparationTime: {
      type: 'string',
    },
    acceptedAt: {
      type: 'string',
    },
    phoneNumber: {
      type: 'string',
    },
    notes: {
      type: 'text',
    },
    status: {
      type: 'string',
      enum: ORDER_STATUS
    },
    paymentMethodToken: {
      type: 'string',
    },
    savePaymentMethod: {
      type: 'boolean'
    },
    total: {
      type: 'string',
    },
    user: {
      model: 'user'
    },
    caterer: {
      model: 'caterer'
    },
    deliveryAddress: {
      model: 'address'
    },
    items: {
      collection: 'orderItem',
      via: 'order'
    }
  }

};
