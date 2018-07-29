var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , LocalStrategy = require('passport-local').Strategy
    , JwtStrategy = require('passport-jwt').Strategy
    , ExtractJwt = require('passport-jwt').ExtractJwt
    , bcrypt = require('bcrypt');

var EXPIRES_IN_MINUTES = 60 * 60 * 24;
var SECRET = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OM";
var ALGORITHM = "HS256";
var ISSUER = "localhost:1337/";
var AUDIENCE = "localhost:1337/";

var socialHandler = function(token, tokenSecret, profile, done) {
  process.nextTick(function() {

    User.findOne({uid: profile.id}, function(err, user) {
      if (user) {
        return done(null, user);
      } else {

        var data = {
          provider: profile.provider,
          uid: profile.id,
          displayName: profile.displayName,
        };

        if (profile.emails && profile.emails[0] && profile.emails[0].value) {
          data.email = profile.emails[0].value;
        }
        if (profile.name && profile.name.givenName) {
          data.firstName = profile.name.givenName;
        }
        if (profile.name && profile.name.familyName) {
          data.lastName = profile.name.familyName;
        }
        if (profile.photos && profile.photos[0] && profile.photos[0].value) {
          data.profilePicture = profile.photos[0].value;
        }

        User.create(data, function(err, user) {
          return done(err, user);
        });
      }
    });
  });
};

var localHandler = function (email, password, done) {
  User.findOne({email: email}, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'Incorrect email.'});
    }

    bcrypt.compare(password, user.password, function (err, res) {
      if (!res)
        return done(null, false, {
          message: 'Invalid Password'
        });
      return done(null, user, {
        message: 'Logged In Successfully'
      });
    });
  });
};

var jwtHandler = function (payload, done) {
  var user = payload.user;
  User.findOne({uid: user.uid}, function (err, user) {
    if (err) {
      return done(err);
    }

    return done(null, user, {});
  });
};

passport.serializeUser(function(user, done) {
  done(null, user.uid);
});

passport.deserializeUser(function(uid, done) {
  User.findOne({uid: uid}, function(err, user) {
    done(err, user);
  });
});

module.exports.jwtSettings = {
  expiresIn: EXPIRES_IN_MINUTES,
  secret: SECRET,
  algorithm : ALGORITHM,
  issuer : ISSUER,
  audience : AUDIENCE
};

/**
 * Configure advanced options for the Express server inside of Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */
module.exports.http = {
  customMiddleware: function(app) {

    passport.use(new FacebookStrategy({
      clientID: sails.config.passport.facebook.clientID,
      clientSecret: sails.config.passport.facebook.clientSecret,
      callbackURL: sails.config.passport.facebook.callbackURL,
      profileFields: ['id', 'displayName', 'emails', 'name', 'photos']
    }, socialHandler));

    passport.use(new GoogleStrategy({
      clientID: sails.config.passport.google.clientID,
      clientSecret: sails.config.passport.google.clientSecret,
      callbackURL: sails.config.passport.google.callbackURL
    }, socialHandler));

    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, localHandler));

    passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      secretOrKey: SECRET,
      issuer : ISSUER,
      audience: AUDIENCE,
      passReqToCallback: false
    }, jwtHandler));

    app.use(passport.initialize());
    app.use(passport.session());
  }

  // Completely override Express middleware loading.
  // If you only want to override the bodyParser, cookieParser
  // or methodOverride middleware, see the appropriate keys below.
  // If you only want to override one or more of the default middleware,
  // but keep the order the same, use the `middleware` key.
  // See the `http` hook in the Sails core for the default loading order.
  //
  // loadMiddleware: function( app, defaultMiddleware, sails ) { ... }


  // Override one or more of the default middleware (besides bodyParser, cookieParser)
  //
  // middleware: {
  //    session: false, // turn off session completely for HTTP requests
  //    404: function ( req, res, next ) { ... your custom 404 middleware ... }
  // }


  // The middleware function used for parsing the HTTP request body.
  // (this most commonly comes up in the context of file uploads)
  //
  // Defaults to a slightly modified version of `express.bodyParser`, i.e.:
  // If the Connect `bodyParser` doesn't understand the HTTP body request
  // data, Sails runs it again with an artificial header, forcing it to try
  // and parse the request body as JSON.  (this allows JSON to be used as your
  // request data without the need to specify a 'Content-type: application/json'
  // header)
  //
  // If you want to change any of that, you can override the bodyParser with
  // your own custom middleware:
  // bodyParser: function customBodyParser (options) { ... return function(req, res, next) {...}; }
  //
  // Or you can always revert back to the vanilla parser built-in to Connect/Express:
  // bodyParser: require('express').bodyParser,
  //
  // Or to disable the body parser completely:
  // bodyParser: false,
  // (useful for streaming file uploads-- to disk or S3 or wherever you like)
  //
  // WARNING
  // ======================================================================
  // Multipart bodyParser (i.e. express.multipart() ) will be removed
  // in Connect 3 / Express 4.
  // [Why?](https://github.com/senchalabs/connect/wiki/Connect-3.0)
  //
  // The multipart component of this parser will be replaced
  // in a subsequent version of Sails (after v0.10, probably v0.11) with:
  // [file-parser](https://github.com/balderdashy/file-parser)
  // (or something comparable)
  //
  // If you understand the risks of using the multipart bodyParser,
  // and would like to disable the warning log messages, uncomment:
  // silenceMultipartWarning: true,
  // ======================================================================


  // Cookie parser middleware to use
  //			(or false to disable)
  //
  // Defaults to `express.cookieParser`
  //
  // Example override:
  // cookieParser: (function customMethodOverride (req, res, next) {})(),


  // HTTP method override middleware
  //			(or false to disable)
  //
  // This option allows artificial query params to be passed to trick
  // Sails into thinking a different HTTP verb was used.
  // Useful when supporting an API for user-agents which don't allow
  // PUT or DELETE requests
  //
  // Defaults to `express.methodOverride`
  //
  // Example override:
  // methodOverride: (function customMethodOverride (req, res, next) {})()
};
