/**
* PaymentMethod.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var uuid = require('uuid');

module.exports = {
  attributes: {
    uid: {
      type: 'string',
      defaultsTo: function() {
        return uuid.v4();
      }
    },
    token: {
      type: 'string'
    },
    uniqueNumberIdentifier: {
      type: 'string'
    },
    user: {
      model: 'user'
    },
  }
};
