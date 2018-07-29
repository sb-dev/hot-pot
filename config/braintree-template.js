var braintree = require('braintree');

module.exports.braintree = {
  environment: braintree.Environment.Sandbox,
  merchantId: "<merchantId>",
  publicKey: "<publicKey>",
  privateKey: "<privateKey>"
};
