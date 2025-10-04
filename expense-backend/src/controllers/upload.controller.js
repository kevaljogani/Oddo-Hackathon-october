const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { toCamelCase } = require('../utils/formatter');

const prisma = new PrismaClient();

// Get upload directory from env or use default
const uploadsDir = process.env.UPLOADS_DIR || 'uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDF files are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB max file size
  fileFilter: fileFilter
}).single('file');

/**
 * Handle file upload to local disk and create attachment record
 */
const uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size exceeds the 8MB limit.' });
          }
          return res.status(400).json({ error: err.message });
        }
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Validate expenseId
      const { expenseId } = req.body;
      if (!expenseId) {
        // Remove the uploaded file if no expenseId
        fs.unlinkSync(path.join(uploadsDir, req.file.filename));
        return res.status(400).json({ error: 'ExpenseId is required.' });
      }

      // Check if expense exists and belongs to the user
      const expense = await prisma.expense.findFirst({
        where: {
          id: expenseId,
          userId: req.user.id
        }
      });

      if (!expense) {
        // Remove the uploaded file if expense not found
        fs.unlinkSync(path.join(uploadsDir, req.file.filename));
        return res.status(404).json({ error: 'Expense not found or you do not have permission.' });
      }

      // Generate URL for file
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8001}`;
      const fileUrl = `${baseUrl}/${uploadsDir}/${req.file.filename}`;
      
      // Create attachment record
      const attachment = await prisma.attachment.create({
        data: {
          filename: req.file.originalname,
          url: fileUrl,
          type: req.file.mimetype,
          size: req.file.size,
          expenseId: expenseId
        }
      });

      // Return success response with attachmentId and fileUrl
      return res.status(201).json(toCamelCase({
        attachment_id: attachment.id,
        file_url: fileUrl
      }));
    } catch (error) {
      console.error('File upload error:', error);
      // Clean up file if there was an error
      if (req.file) {
        try {
          fs.unlinkSync(path.join(uploadsDir, req.file.filename));
        } catch (unlinkError) {
          console.error('Error removing file:', unlinkError);
        }
      }
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  });
};

/**
 * OCR endpoint stub
 */
const processOCR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // This is a stub that can be replaced with actual OCR implementation
    // For now, return mock data
    setTimeout(() => {
      res.json({
        success: true,
        text: "OCR processed text would appear here",
        data: {
          amount: 125.50,
          date: "2023-10-15",
          vendor: "Office Supplies Inc.",
          category: "OFFICE_SUPPLIES"
        }
      });
    }, 1000); // Simulate processing delay
  } catch (error) {
    console.error('OCR processing error:', error);
    res.status(500).json({ message: 'Failed to process OCR' });
  }
};

module.exports = {
  uploadFile,
  processOCR
};