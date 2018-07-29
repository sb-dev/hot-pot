/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var passport = require('passport'),
     btoa = require('btoa');

module.exports = {

	// _config: {
	// 		actions: false,
	// 		shortcuts: false,
	// 		rest: false
	// },

  /**
   * Sign in user.
   * @param {object} req - The title of the book.
   * @param {object} res - The author of the book.
   */
	login: function(req, res) {
			passport.authenticate('local', function(err, user, info) {
					if ((err) || (!user)) {
              console.log('local authenticate failed', info.message);
							return res.send({
                  success: false,
									message: 'Wrong credentials.',
									user: user
							});
					}

          var result = {
            success: true,
            message: info.message,
            user: user,
            token: AuthService.createToken(user)
          };

          switch (user.role) {
            case 'caterer':
              var options = {
                id: user.caterer
              };
              CatererService.findCaterer(options).then(function(caterer){
                result.user.caterer = caterer.toJSON();
                return res.send(result);
              });
              break;
            case 'driver':
            default:
              return res.send(result);
          }

			})(req, res);
	},

  facebook: function(req, res) {
    passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        var token = AuthService.createToken(user);
        res.redirect('/#/authenticate/'+ token);
        return;
      });
    })(req, res);
  },

	logout: function(req, res) {
			req.logout();
			res.redirect('/');
	}

};
