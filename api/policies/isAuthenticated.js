/**
 * isAuthenticated
 * @description :: Policy to inject user in req via JSON Web Token
 */
var passport = require('passport');

module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (error, user, info) {
    if (error) return res.serverError(error);
    if (!user)
      return res.forbidden('You are not permitted to perform this action.');

    req.user = user;
    next();
  })(req, res);
};

// var passport = require('passport');
//
// module.exports = function(req, res, next) {
//
//   passport.authenticate('jwt', function (error, user, info) {
//     console.log('sessionAuth', info);
//     if (error) return res.serverError(error);
//     if (!user)
//       return res.forbidden('You are not permitted to perform this action.');
//     req.user = user;
//
//     next();
//   })(req, res);
//
//   // SessionAuth.js
//   // User is allowed, proceed to the next policy,
//   // or if this is the last policy, the controller
//   // if (req.session.authenticated) {
//   //   return next();
//   // }
//
//   // User is not allowed
//   // (default res.forbidden() behavior can be overridden in `config/403.js`)
//   // return res.forbidden('You are not permitted to perform this action.');
// };
