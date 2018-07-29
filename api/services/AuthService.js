// AuthService.js

var jwt = require('jsonwebtoken');

module.exports = {
  /**
   * Create a token based on the passed user
   * @param user
   */
  createToken: function(user)
  {
    return jwt.sign({
        user: user.toJSON()
      },
      sails.config.jwtSettings.secret,
      {
        algorithm: sails.config.jwtSettings.algorithm,
        expiresIn: sails.config.jwtSettings.expiresIn,
        issuer: sails.config.jwtSettings.issuer,
        audience: sails.config.jwtSettings.audience
      }
    );
  }
};
