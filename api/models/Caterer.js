/**
* Caterer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    user: {
      collection: 'user',
      via: 'caterer'
    },
    orders: {
      collection: 'order',
      via: 'caterer'
    },
    dishes: {
      collection: 'dish',
      via: 'caterer'
    },
    online: {
      type: 'boolean',
      defaultsTo: false
    },
    active: {
      type: 'boolean',
      defaultsTo: false
    },
    name: {
      type: 'string'
    },
    phoneNumber: {
      type: 'string'
    },
    postcode: {
      type: 'string'
    },
    street: {
      type: 'string'
    },
    latitude : {
      type: 'string'
    },
    longitude : {
      type: 'string'
    },
  }

};
