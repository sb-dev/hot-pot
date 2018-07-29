/**
* Address.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    orders: {
      collection: 'order',
      via: 'deliveryAddress'
    },
    user: {
      model: 'user'
    },
    line1: {
      type: 'string'
    },
    line2: {
      type: 'string'
    },
    postcode: {
      type: 'string'
    },
    phone: {
      type: 'string'
    }
  }
};
