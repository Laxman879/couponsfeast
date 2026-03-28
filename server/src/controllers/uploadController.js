import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const logoType = req.body.logoType || 'logo';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${logoType}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const logoType = req.body.logoType;
  
  // Special handling for favicon
  if (logoType === 'favicon') {
    if (file.mimetype === 'image/x-icon' || file.mimetype === 'image/vnd.microsoft.icon' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Favicon must be ICO or PNG format!'), false);
    }
  } else {
    // Accept all image files for other logo types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
  // Removed file size limit
});

export const uploadLogo = async (req, res) => {
  try {
    console.log('=== UPLOAD DEBUG ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('Logo Type:', req.body.logoType);
    console.log('===================');

    // Always ensure we send a response
    const sendResponse = (data, statusCode = 200) => {
      if (!res.headersSent) {
        res.status(statusCode).json(data);
      }
    };

    if (!req.file) {
      console.log('ERROR: No file in request');
      return sendResponse({ 
        error: 'No file uploaded',
        debug: {
          hasFile: !!req.file,
          hasFiles: !!req.files,
          bodyKeys: Object.keys(req.body || {}),
          contentType: req.headers['content-type']
        }
      }, 400);
    }

    const logoUrl = `/uploads/${req.file.filename}`;
    const logoType = req.body.logoType || 'logo';
    
    console.log(`SUCCESS: ${logoType} uploaded:`, logoUrl);
    
    const response = {
      message: `${logoType.charAt(0).toUpperCase() + logoType.slice(1)} uploaded successfully`,
      logoUrl: logoUrl,
      filename: req.file.filename,
      logoType: logoType
    };
    
    console.log('Sending response:', response);
    sendResponse(response);
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const deleteLogo = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Logo deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};