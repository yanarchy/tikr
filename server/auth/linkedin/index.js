'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.get('/', passport.authorize('linkedin', {
	failureRedirect: '/',
}))

.get('/callback', auth.isAuthenticated(), passport.authorize('linkedin', {
	successRedirect: 'http://reddit.com',
	failureRedirect: 'http://www.cnn.com'
}), auth.linkedInLoginCallback);

module.exports = router;