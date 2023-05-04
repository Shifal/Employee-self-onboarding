const multer = require('multer');
const path = require('path');
const fs = require('fs')

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null,Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = function (req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('File type not allowed. Only JPEG, PNG, and GIF images are allowed.');
    error.status = 400;
    cb(error, false);
  }
}
const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 1000000 }, // 1MB file size limit
});

module.exports = upload;