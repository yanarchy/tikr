'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'tikr-secret',

  GITHUB_ID:       '4e9a2516481e2037b80c',
  GITHUB_SECRET:   '1a5549b437b4d9e872bed24b39243b008b5e1f4f',

  LINKEDIN_API_KEY: '75kxsb2sjdx84e',
  LINKEDIN_SECRET_KEY: 'SMdcuC3uqIkzW67D',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
