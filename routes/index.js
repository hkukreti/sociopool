var express = require('express');
var router = express.Router();
const aeh = require('../middleware/asyncErrorHandler');

/* GET home page. */
router.get('/', aeh(function(req, res, next) {
  res.success("Server is Working...")
}));

module.exports = router;
