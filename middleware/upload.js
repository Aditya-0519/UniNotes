const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "college_notes",
    resource_type: "raw",
    public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`
  })
});

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB
    },
    fileFilter(req, file, cb) {

        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed."));
        }

        cb(null, true);
    }
});

module.exports = { upload, cloudinary };