'use strict';

var path = require('path');
var _ = require('lodash');
var local = {};
try {
  local = require('./../local.env.js');
} catch(err) {
  console.log(err);
}


function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'tikr-secret'
  },

  //github and linkedin
  github: {
    clientID: local.GITHUB_ID || process.env.GITHUB_ID || 'id',
    clientSecret: local.GITHUB_SECRET || process.env.GITHUB_SECRET || 'secret',
    callbackURL: (process.env.GITHUB_DOMAIN || '') + '/auth/github/callback'
  },

  linkedin: {
    consumerKey: local.LINKEDIN_API_KEY || process.env.LINKEDIN_API_KEY || 'id',
    consumerSecret: local.LINKEDIN_SECRET_KEY || process.env.LINKEDIN_SECRET_KEY || 'secret',
    callbackURL: (process.env.LINKEDIN_DOMAIN || '') + '/auth/linkedin/callback'

  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
