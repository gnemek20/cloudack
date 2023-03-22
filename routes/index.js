var express = require('express');
var router = express.Router();

const multer = require('multer');
const upload = multer();

/* Google api */
const stream = require('stream');
const { google } = require('googleapis');

const KEYFILEPATH = `${process.cwd()}/public/credential/credentials.json`;
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES
})

const drive = google.drive({ version: 'v3', auth });

drive.files.list({ q: 'mimeType="image/png"' }).then((res) => {
  // 특정 이미지 가져오는 법
  // for (let i = 0; i < res.data.files.length; i++) {
  //   if (res.data.files[i].name === 'photo.jpg') {
  //     console.log(res.data.files[i])
  //   }
  // }

  // 파일 전부 삭제
  // for (let i = 0; i < res.data.files.length; i++) {
  //   drive.files.delete({ fileId: res.data.files[i].id })
  // }

  // console.log(res.data.files)
})

drive.files.list().then((res) => {
  console.log(res.data.files)

  // for (let i = 0; i < res.data.files.length; i++) {
  //   drive.files.delete({ fileId: res.data.files[i].id })
  // }
})

// drive.files.create({
//   requestBody: {
//     name: 'dummy',
//     mimeType: 'application/vnd.google-apps.folder',
//     parents: ['1AuKfzwK9NPsobpXlR9a6i5a29i9rr2qX']
//   },
//   fields: 'id'
// })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Methods */
router.get('/dummy', (req, res) => {
  res.send('I\'m dummy :)');
});

router.get('/image', (req, res) => {
  res.sendFile(`${process.cwd()}/public/images/chicken.png`);
});

/* POST Methods */
router.post('/upload', upload.any(), async (req, res) => {
  const uploadFile = async (file) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const { data } = await drive.files.create({
      media: {
        mimeType: file.mimeType,
        body: bufferStream
      },
      requestBody: {
        name: file.originalname,
        parents: ['1AuKfzwK9NPsobpXlR9a6i5a29i9rr2qX']
      },
      fields: 'id,name'
    })

    console.log(`Uploaded file ${data.name} ${data.id}`);
  }

  try {
    console.log(req.files);
    const { files } = req;

    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
    }

    res.status(200).send('submitted');
  }
  catch (e) {
    console.log(e.message);
    res.errored();
  }
})

module.exports = router;
