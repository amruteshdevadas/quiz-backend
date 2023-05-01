var express = require('express');
var router = express.Router();
var authorize = require('../helpers')


/* GET users listing. */
router.get('/', authorize, function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
