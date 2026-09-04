const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("./upload");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "uninotes_avatars",
        resource_type: "image",
        public_id: `avatar-${req.user._id}-${Date.now()}`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    })
});

const avatarUpload = multer({
    storage,

    limits: {
        fileSize: 2 * 1024 * 1024 // 2 MB
    },

    fileFilter(req, file, cb) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error("Only JPG, PNG and WebP images are allowed.")
            );
        }

        cb(null, true);
    }
});

module.exports = avatarUpload;