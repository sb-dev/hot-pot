/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt'),
    uuid = require('uuid');

module.exports = {

  // identity: 'caterer',
  attributes: {
    provider: {
      type: 'string',
      defaultsTo: ''
    },
    uid: {
      type: 'string',
      defaultsTo: function() {
        return uuid.v4();
      }
    },
    customerId: {
      type: 'string',
      defaultsTo: ''
    },
    displayName: {
      type: 'string',
      defaultsTo: ''
    },
    profilePicture: {
      type: 'string'
    },
    firstName: {
      type: 'string',
      defaultsTo: ''
    },
    lastName: {
      type: 'string',
      defaultsTo: ''
    },
    email: {
      type: 'email',
      unique: true,
      index: true
    },
    role: {
      type: 'string',
      defaultsTo: 'user'
    },
    password: {
      type: 'string'
    },
    mobilePhone: {
      type: 'string'
    },
    deliveryAddresses: {
      collection: 'address',
      via: 'user'
    },
    paymentMethods: {
      collection: 'paymentMethod',
      via: 'user'
    },
    orders: {
      collection: 'order',
      via: 'user'
    },
    caterer: {
      model: 'caterer'
    },
    // Attribute methods
    getFullName: function (){
      return this.firstName + ' ' + this.lastName;
    },
    toJSON: function () {
      var user = this.toObject();
      delete user.password;
      return user;
    }
  }
};
