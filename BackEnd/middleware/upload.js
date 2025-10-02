const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder = "others"; // default
        if (req.baseUrl.includes("books")) folder = "book-covers";
        if (req.baseUrl.includes("users")) folder = "user-profiles";

        return {
            folder,
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
        };
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
