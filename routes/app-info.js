var express = require('express');
var router = express.Router();

/* GET app information */
router.get('/', function( req, res, next ) {
	res.json({ ip: req.connection.remoteAddress });
});

module.exports = router;