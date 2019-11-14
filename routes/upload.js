let express = require('express');
let uploadUtils = require('../common/uploadUtils');
let router = express.Router();

let bankWorkerObject = uploadUtils.createBankWorkerObject(['public']);
const bankWorkerFileMaxCount = 10;

router.post('/',  bankWorkerObject.array('file', bankWorkerFileMaxCount), function(req,res,next){
  let fileUrlList = [];
  let fileUrl = `http://${req.headers.host}/`;

  for (let key in req.query) {
    fileUrl = fileUrl.concat(`${req.query[key]}/`);
  }

  req.files.forEach(function (file, index) {
    fileUrlList.push(fileUrl.concat(file.originalname))
  });

  res.json({
    err : false,
    fileUrlList : fileUrlList
  });
  res.end();
});

module.exports = router;
