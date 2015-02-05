'use strict';

var express = require('express');
var controller = require('./facets.controller.js');

var router = express.Router();

router.get('/', controller.facets);

module.exports = router;
