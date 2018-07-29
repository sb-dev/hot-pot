/**
* Dish.js
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
    online: {
      type: 'boolean'
    },
    numberOfPortions: {
      type: 'string'
    },
    preparationTime: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'text'
    },
    price: {
      type: 'float'
    },
    picture: {
      type: 'string'
    },
    cuisine: {
      type: 'string'
    },
    dishType: {
      type: 'string'
    },
    meal: {
      type: 'string'
    },
    caterer: {
      model: 'caterer'
    },
  }
};
