var express = require('express');
var router = express.Router();

var userModel = require('../models/users.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// debug
router.get('/test', (req, res, next) => {
  userModel.all().then(rows => {
    res.status(200).json({
      message: 'Connect database successful'
    });
  }).catch(err => {
    res.status(400).json({
      message: 'Connect database fail'
    });
  });
});

module.exports = router;
