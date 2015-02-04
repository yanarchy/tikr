'use strict';

var express = require('express');
var controller = require('./languages.controller.js');

var router = express.Router();

router.get('/', controller.languages);

module.exports = router;
