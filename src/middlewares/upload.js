const multer = require("multer");
const path = require("path");

const maxSize = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Check file type
  const fileTypes = /jpg|jpeg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(
      new Error(
        "Only image files with .jpg, .jpeg, or .png extensions are allowed"
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter,
});

module.exports = upload;
