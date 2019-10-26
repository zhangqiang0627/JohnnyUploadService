let path = require('path');
let fs = require("fs");
let multer = require('multer');

exports.createBankWorkerObject = function (folders) {
  let rootDir = path.resolve(__dirname, '..');
  for(let i = 0; i < folders.length; i++){
    rootDir = path.join(rootDir, folders[i]);
  }
  makeDir(rootDir);

  let storage = multer.diskStorage({
    destination: function (req, file, cb){
      let bankCode = req.query.bankCode;
      let branchCode = req.query.branchCode;
      let dirName = req.query.dirName;
      let uploadDir = rootDir;

      if(bankCode !== undefined){
        uploadDir = path.join(uploadDir, bankCode);
      }
      if(branchCode !== undefined){
        uploadDir = path.join(uploadDir, branchCode);
      }

      if(dirName !== undefined){
        uploadDir = path.join(uploadDir, dirName);
      }
      makeDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: function (req, file, cb){
      //设置文件的名字为其原本的名字，也可以添加其他字符，来区别相同文件，例如file.originalname+new Date().getTime();利用时间来区分
      cb(null, file.originalname)
    }
  });

  return multer({storage: storage});
};

function makeDir(dirpath) {
  if (!fs.existsSync(dirpath)) {
    let pathtmp;
    dirpath.split("/").forEach(function(dirname) {
      if (pathtmp) {
        pathtmp = path.join(pathtmp, dirname);
      }
      else {
        //如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
        if(dirname){
          pathtmp = dirname;
        }else{
          pathtmp = "/";
        }
      }
      if (!fs.existsSync(pathtmp)) {
        if (!fs.mkdirSync(pathtmp)) {
          return false;
        }
      }
    });
  }
  return true;
}