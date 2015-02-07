exports.setup = function(User, config) {
    var passport = require('passport');
    var auth = require('../auth.service');
    var LinkedInStrategy = require('passport-linkedin').Strategy;
    passport.use(new LinkedInStrategy({
                consumerKey: config.linkedin.consumerKey,
                consumerSecret: config.linkedin.consumerSecret,
                callbackURL: config.linkedin.callbackURL,
                passReqToCallback: true
            },
            function(req, token, tokenSecret, profile, done) {
                console.log(profile);
                return done(null, profile);

                // if (!req.user) {
                //   //redirect to log into github first?
                //   console.log(' REQ ACCOUNTS MAN!!!');
                //   console.log(req.account);
                //   console.log(req.user);
                //   console.log('FUCK YOU ARE NOT SIGNED IN');
                // } else {
                //   console.log(req.user);
                //   console.log(req.account);
                //   return done(null, req.user);
                // }
                // User.findOne({
                //   'linkedinusername': profile.id
                // }, function(err, user) {
                //   if (err) {
                //     return done(err);
                //   }
                //   if (!user) {
                //     console.log('NO USER FOUND FOR LINKEDIN PASS PORT');
                // user = new User({
                //   linkedinusername: profile.username,
                //   linkedin: profile._json
                // });
                // console.log(user);
                // console.log('IN PASSPORT LINKEDIN')
                // user.update(function(err) {
                //   if (err) return done(err);
                //   console.log('hello');
                //   return done(err, user);
                // } else {
                //   return done(err, user);
                // }
            })
        // }
    );
};