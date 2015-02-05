exports.setup = function (User, config) {
  var passport = require('passport');
  var GitHubStrategy = require('passport-github').Strategy;
  var githubKeys;

  try {
    githubKeys = require('../../config/local.env.js');
  } catch(e) {
    //do nothing
  }

  passport.use(new GitHubStrategy({
      clientID: (process.env.GITHUB_ID || githubKeys.GITHUB_ID),
      clientSecret: (process.env.GITHUB_SECRET || githubKeys.GITHUB_SECRET)
    },
    function(token, tokenSecret, profile, done) {
    User.findOne({
      'github.id': profile.id
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: 'github',
          github: profile._json
        });
        user.save(function(err) {
          if (err) return done(err);
          user.getSkills(token);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
    }
  ));
};
