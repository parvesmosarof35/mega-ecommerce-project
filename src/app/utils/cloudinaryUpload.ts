import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { uploadBufferToCloudinary } from './cloudinary';

// Memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to upload directly to Cloudinary
export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.file) {
      // Create a unique filename for the upload
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const filename = `hero-${timestamp}-${randomString}`;
      
      // Upload buffer directly to Cloudinary
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        'hero-sections',
        'high',
        filename
      );
      
      // Store Cloudinary URL in request body for easy access
      req.body.cloudinaryUrl = uploaded.secure_url;
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image to Cloudinary',
      error: error,
    });
  }
};

export default upload;
