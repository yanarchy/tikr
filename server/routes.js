/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var passport = require('passport');

module.exports = function(app) {


  //continuous Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Insert routes below
  app.use('/api/skills', require('./api/skills'));
  app.use('/api/languages', require('./api/languages'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/messages', require('./api/message'));
  app.use('/api/profiles', require('./api/user'));
  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};