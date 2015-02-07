exports.setup = function(User, config) {
  var passport = require('passport');
  var GitHubStrategy = require('passport-github').Strategy;
  var githubKeys;

  passport.use(new GitHubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      console.log('IN GITHUB PASSPORT');

      User.findOne({
        'github.id': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.name,
            role: 'user',
            provider: 'github',
            github: profile._json
          });
          user.save(function(err) {
            if (err) return done(err);
            user.getSkills(token);
            console.log('SAVING USER IN GITHUB PASSPORT')
            console.log(user);
            return done(err, user);
          });
        } else {
          console.log("IS THERE AN ID?");

          return done(err, user);
        }
      });
    }
  ));

};