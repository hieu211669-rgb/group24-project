const multer = require('multer');
const path = require('path');

// Thư mục lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // tạo folder uploads/ trong project
  },
  filename: function (req, file, cb) {
    // Đổi tên file tránh trùng
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const upload = multer({ storage });

module.exports = upload;
