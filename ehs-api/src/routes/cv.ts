import { Router, Request, Response } from 'express';
import multer from 'multer';
import { CVService } from '../services/CVService';
import { authMiddleware, reviewerMiddleware } from '../middleware/auth';
// No registration restrictions
import { FileProcessingService } from '../services/FileProcessingService';
import { CV } from '../models/CV';
import fs from 'fs';
import path from 'path';
import { AIAgentService } from '../services/AIAgentService';

const router = Router();
const cvService = new CVService();
const fileService = new FileProcessingService();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/msword'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

const photoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true); else cb(new Error('Only image files allowed'));
  }
});

// Upload and process CV
router.post('/upload', authMiddleware, upload.single('cv'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const userId = req.user._id;
    const result = await cvService.createCV(userId, req.file);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Upload failed: ${error}`
    });
  }
});

// Upload/update profile photo
router.post('/:cvId/photo', authMiddleware, photoUpload.single('photo'), async (req: Request, res: Response) => {
	try {
		const { cvId } = req.params;
		const userId = req.user._id;
		
		if (!req.file) return res.status(400).json({ success: false, error: 'No photo uploaded' });

		// Check if CV exists and belongs to user
		const cv = await CV.findById(cvId);
		if (!cv) {
			return res.status(404).json({ success: false, error: 'CV not found' });
		}
		
		if (cv.userId.toString() !== userId.toString()) {
			return res.status(403).json({ success: false, error: 'Access denied. CV does not belong to user.' });
		}

		const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
		await fs.promises.mkdir(uploadsDir, { recursive: true });

		const ext = (req.file.mimetype.split('/')[1] || 'jpg').replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
		const safeBase = (req.file.originalname || 'photo').replace(/\.[^a-zA-Z0-9_.-]/g, '') || 'photo';
		const filename = `${Date.now()}-${safeBase}.${ext}`;
		const filepath = path.join(uploadsDir, filename);

		await fs.promises.writeFile(filepath, req.file.buffer);
		const base = `${req.protocol}://${req.get('host')}`;
		const url = `/uploads/${filename}`;
		const absoluteUrl = `${base}${url}`;

		// Update CV with photo URL
		const processed: any = cv.processedData || {};
		processed.personalInfo = processed.personalInfo || {};
		processed.personalInfo.photoUrl = absoluteUrl;

		cv.processedData = processed;
		await cv.save();

		res.json({ success: true, data: { url: absoluteUrl }, timestamp: new Date() });
	} catch (error) {
		console.error('Photo upload error:', error);
		res.status(500).json({ success: false, error: 'Photo upload failed' });
	}
});

// Get CV by ID
router.get('/:cvId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { cvId } = req.params;
    const result = await cvService.getCVById(cvId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to retrieve CV: ${error}`
    });
  }
});

// Get user's CVs
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await cvService.getUserCVs(userId, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to retrieve CVs: ${error}`
    });
  }
});

// Update CV
router.put('/:cvId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { cvId } = req.params;
    const updateData = req.body;
    
    const result = await cvService.updateCV(cvId, updateData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to update CV: ${error}`
    });
  }
});

// Approve CV (reviewers and admins only)
router.post('/:cvId/approve', authMiddleware, reviewerMiddleware, async (req: Request, res: Response) => {
  try {
    const { cvId } = req.params;
    const approvedBy = req.user._id;
    
    const result = await cvService.approveCV(cvId, approvedBy);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to approve CV: ${error}`
    });
  }
});

// Delete CV
router.delete('/:cvId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { cvId } = req.params;
    const result = await cvService.deleteCV(cvId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to delete CV: ${error}`
    });
  }
});

// Get processing status
router.get('/:cvId/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { cvId } = req.params;
    const status = await cvService.getProcessingStatus(cvId);
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to get status: ${error}`
    });
  }
});

// Test AI agent endpoint
router.get('/test-ai', async (req, res) => {
	try {
		const aiService = new AIAgentService()
		
		// Test with a simple text
		const testText = "John Smith - Chef at Restaurant ABC from January 2020 to present. I am responsible for managing kitchen staff and I have experience in French cuisine."
		
		console.log('Testing AI agent with text:', testText)
		
		// Test the text cleanup and formatting
		const result = await aiService.convertToStructuredData(testText)
		
		res.json({
			success: true,
			message: 'AI agent test completed',
			result: result
		})
	} catch (error: any) {
		console.error('AI agent test error:', error)
		res.status(500).json({
			success: false,
			error: error.message || 'AI agent test failed'
		})
	}
})

export default router;
