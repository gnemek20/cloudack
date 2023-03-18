var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Methods */
router.get('/cwd', (req, res) => {
  res.send(process.cwd());
});

router.get('/image', (req, res) => {
  res.sendFile(`${process.cwd()}/public/images/chicken.png`);
});

/* POST Methods */

module.exports = router;
