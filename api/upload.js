const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const randomId = generateRandomId(3);
    cb(null, `${randomId}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}).single('image');

// Generate random 3-character ID
function generateRandomId(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error uploading file' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }
    
    try {
      const filePath = req.file.path;
      const ext = path.extname(filePath).toLowerCase();
      const fileName = path.basename(filePath, ext);
      
      // Optimize image with sharp
      await sharp(filePath)
        .resize(1200, 1200, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .toFormat(ext === '.png' ? 'png' : 'jpeg', { 
          quality: 80,
          progressive: true 
        })
        .toFile(filePath);
      
      // Schedule deletion after 30 minutes
      setTimeout(() => {
        fs.unlink(filePath, err => {
          if (err) console.error('Error deleting file:', err);
        });
      }, 30 * 60 * 1000);
      
      const imageUrl = `${req.headers.host}/uploads/${req.file.filename}`;
      
      return res.status(200).json({ 
        success: true, 
        imageUrl: `https://${imageUrl}`,
        message: 'Image uploaded successfully' 
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error processing image' 
      });
    }
  });
};
