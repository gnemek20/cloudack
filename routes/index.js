var express = require('express');
var router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'public/images');
  },
  filename(req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({storage: storage});

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
router.post('/upload', upload.array('file'), (req, res) => {
  res.send('success');
});

module.exports = router;
