const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Ok');
});

router.get('/healthcheck', function (req, res, next) {
    res.send('Ok');
});

module.exports = router;
