exports.setup = function(User, config) {
  var passport = require('passport');
  var LinkedInStrategy = require('passport-linkedin').Strategy;

  passport.use(new LinkedInStrategy({
      consumerKey: config.linkedin.consumerKey,
      consumerSecret: config.linkedin.consumerSecret,
      callbackURL: config.linkedin.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({
        'linkedin.id': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        // if (!user) {
        //   user = new User({
        //     name: profile.displayName,
        //     username: profile.username,
        //     role: 'user',
        //     provider: 'linkedin',
        //     linkedin: profile._json
        //   });
        //   user.save(function(err) {
        //     if (err) return done(err);
        //     user.getSkills(token);
        //     return done(err, user);
        //   });
        // } else {
        //   return done(err, user);
        // }
      });
    }
  ));
};