import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
// No registration restrictions
import { UserModel } from '../models/User';
import { CV as CVModel } from '../models/CV';
import { CVStatus } from '../types';

const router = Router();

// Submit registration form and mark user as completed
router.post('/submit', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const registrationData = req.body;

    // Validate required fields
    if (!registrationData || Object.keys(registrationData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Registration form data is required'
      });
    }

    // Update user to mark registration as completed
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { 
        // registrationCompleted field removed
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Create or update CV with registration form data
    let cv = await CVModel.findOne({ userId });
    
    if (cv) {
      // Update existing CV with registration form data
      cv.registrationForm = registrationData;
      cv.updatedAt = new Date();
      await cv.save();
    } else {
      		// Create new CV with registration form data
		cv = new CVModel({
			userId,
			registrationForm: registrationData,
			status: CVStatus.UPLOADED,
			createdAt: new Date(),
			updatedAt: new Date()
		});
      await cv.save();
    }

    res.json({
      success: true,
      message: 'Registration form submitted successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          // registrationCompleted field removed
        },
        cv: {
          id: cv._id,
          status: cv.status
        }
      }
    });

  } catch (error) {
    console.error('Registration submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit registration form'
    });
  }
});

// Get registration form data
router.get('/form', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const cv = await CVModel.findOne({ userId });
    
    if (!cv || !cv.registrationForm) {
      return res.status(404).json({
        success: false,
        error: 'Registration form not found'
      });
    }

    res.json({
      success: true,
      data: cv.registrationForm
    });

  } catch (error) {
    console.error('Get registration form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve registration form'
    });
  }
});

// Check registration completion status
router.get('/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        // registrationCompleted field removed
      }
    });

  } catch (error) {
    console.error('Get registration status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve registration status'
    });
  }
});

// Test endpoint removed - no longer needed

export default router;
