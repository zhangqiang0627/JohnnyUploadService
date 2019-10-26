let express = require('express');
let uploadUtils = require('../common/uploadUtils');
let router = express.Router();

let bankWorkerObject = uploadUtils.createBankWorkerObject(['public','bankWorker']);
const bankWorkerFileMaxCount = 10;

router.post('/bankWorker',  bankWorkerObject.array('file', bankWorkerFileMaxCount), function(req,res,next){
  let fileUrlList = [];
  let host = req.headers.host;
  let bankCode = req.query.bankCode;
  let branchCode = req.query.branchCode;
  let dirName = req.query.dirName;

  let fileUrl = `http://${host}/bankWorker/`;

  if(bankCode !== undefined){
    fileUrl = fileUrl.concat(`${bankCode}/`);
  }
  if(branchCode !== undefined){
    fileUrl = fileUrl.concat(`${branchCode}/`);
  }
  if(dirName !== undefined){
    fileUrl = fileUrl.concat(`${dirName}/`);
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
