'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var request = require('request');
var Promise = require('bluebird');
var githubKeys;

try {
  githubKeys = require('../../config/local.env.js');
} catch (e) {
  //do nothing
}

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function(err, users) {
    if (err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({
      _id: user._id
    }, config.secrets.session, {
      expiresInMinutes: 60 * 5
    });
    res.json({
      token: token
    });
  });
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    console.log("LOGGING USER JSON", user);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function(err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.getReposPromise = function(user, username) {
  return new Promise(function(resolve, reject) {
    var repoOptions = {
      url: user.repos_url + "?client_id=" + (process.env.GITHUB_ID || githubKeys.GITHUB_ID) + "&client_secret=" + (process.env.GITHUB_SECRET || githubKeys.GITHUB_SECRET) + "&page=1&per_page=3",
      headers: {
        'User-Agent': username
      }
    };

    request(repoOptions, function(error, response, body) {
      if (!error) {
        user['repos'] = JSON.parse(response.body);
        resolve(user)
      } else {
        reject(error);
      }
    });
  });
};

var changedUsers = [];
var getUsersPromise = function(users, username) {
  var promises = users.items.map(function(user) {
    return exports.getReposPromise(user, username)
      .then(function(newUser) {
        return newUser;
      })
      .catch(function(error) {
        console.log(err);
        return user;
      });
  });

  changedUsers = users;
  return Promise.all(promises);
};

/**
 * Query for users by skills
 */
exports.search = function(req, res, next) {
  var options = {
    url: 'https://api.github.com/search/users?q=+language:' + encodeURIComponent(req.body.skill) + "&page=" + req.body.pageNumber + "&per_page=10",
    headers: {
      'User-Agent': req.body.username
    }
  };

  request(options, function(error, response, body) {

    if (!error) {
      var users = JSON.parse(decodeURIComponent(response.body));

      getUsersPromise(users, req.body.username)
        .then(function() {
          res.send([changedUsers]);
        })
        .catch(function(error) {
          console.log('error getting users', error);
        });
    } else {
      console.log(error);
      res.send(500);
    }
  })
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.getUserProfile = function(req, res, next) {

  User.findOne({
      'github.login': req.params.githubUsername
    },
    '-salt -hashedPassword',
    function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send('Could not find that profile', 404);
      }

      // Method get user information
      exports.getReposPromise(user.github, user.github.login)
        .then(function(newUser) {
          user.github = newUser;
          res.json(user);
        })
        .catch(function(error) {
          console.log(err);
        });

      //console.log("THISIS THE USER DATA ON THE SERVER", user);
    });
};

exports.postNewSkill = function(req, res, next) {
  //TODO verify that user authorized to add a skill on server side

  User.findOneAndUpdate({
      'github.login': req.params.githubUsername
    }, {
      $push: {
        skills: req.body
      }
    }, {
      safe: true
    },
    function(err, user) { //user is the full updated user document (a js object)
      if (err) {
        res.send(500);
      } else {
        res.json(user);
      }
    }
  );
};