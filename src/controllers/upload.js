const cloudinary = require("../configs/cloudinary");
const { response } = require("../helpers/common");
const uploadSingle = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    response(
      res,
      { file_url: result.secure_url },
      201,
      "file berhasil diupload"
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  uploadSingle,
};
