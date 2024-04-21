"use strict";
const multer = require('multer');
// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});
// Multer file filter
const fileFilter = (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only image files are allowed.'), false);
    }
};
// Multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});
// Multer single file upload middleware
const singleUpload = (fieldName) => {
    return upload.single(fieldName);
};
// Multer multiple files upload middleware
const multipleUpload = (fieldName, maxCount) => {
    return upload.array(fieldName, maxCount);
};
module.exports = { singleUpload, multipleUpload };
