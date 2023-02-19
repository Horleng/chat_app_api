const multer = require('multer');
const path = require('path');
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname,"../img"));
    },
    filename: (req, file, cb) => {
        cb(null,Date.now()+".jpg");
    }
})

module.exports = multer({storage: Storage});