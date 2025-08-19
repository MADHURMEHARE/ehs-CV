import { Router, Request, Response } from 'express';
import { CV } from '../models/CV';
import { ExportService } from '../services/ExportService';
import { RegistrationFormService } from '../services/RegistrationFormService';

const router = Router();
const exportService = new ExportService();
const registrationFormService = new RegistrationFormService();

router.get('/:cvId/docx', async (req: Request, res: Response) => {
	try {
		const { cvId } = req.params;
		const cv = await CV.findById(cvId);
		if (!cv) return res.status(404).json({ success: false, error: 'CV not found' });
		const buffer = await exportService.generateDocx(cv.processedData as any);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
		res.setHeader('Content-Disposition', `attachment; filename="${cv.processedData?.personalInfo?.firstName || 'cv'}.docx"`);
		res.send(Buffer.from(buffer));
	} catch (error) {
		res.status(500).json({ success: false, error: `Export failed: ${error}` });
	}
});

router.get('/:cvId/registration', async (req: Request, res: Response) => {
	try {
		const { cvId } = req.params;
		const cv = await CV.findById(cvId);
		if (!cv) return res.status(404).json({ success: false, error: 'CV not found' });
		const buffer = await registrationFormService.generateDocx((cv as any).registrationForm || {});
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
		res.setHeader('Content-Disposition', `attachment; filename="RegistrationForm_${cvId}.docx"`);
		res.send(Buffer.from(buffer));
	} catch (error) {
		res.status(500).json({ success: false, error: `Export failed: ${error}` });
	}
});

// Test photo handling endpoint
router.get('/test-photo', async (req, res) => {
	try {
		// Create a sample CV data with photo
		const sampleCV = {
			personalInfo: {
				firstName: 'John',
				lastName: 'Doe',
				jobTitle: 'Professional Chef',
				photoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 pixel PNG
				nationality: 'British',
				dateOfBirth: '1990-01-15',
				maritalStatus: 'Single',
				nonSmoker: true,
				drivingLicence: true
			},
			profile: 'Experienced chef with 10+ years in fine dining restaurants.',
			experience: [
				{
					id: 'exp1',
					position: 'Head Chef',
					company: 'The Grand Hotel',
					startDate: '2020-01-01',
					endDate: '2023-12-31',
					current: false,
					description: ['Managed kitchen staff of 15', 'Created seasonal menus', 'Achieved 5-star rating'],
					achievements: ['Led team to Michelin star recognition', 'Reduced food costs by 20%']
				}
			],
			education: [
				{
					id: 'edu1',
					degree: 'Culinary Arts',
					institution: 'Le Cordon Bleu',
					field: 'Culinary Arts',
					startDate: '2008-09-01',
					endDate: '2010-06-30'
				}
			],
			skills: ['French Cuisine', 'Menu Planning', 'Kitchen Management'],
			interests: ['Wine Tasting', 'Travel', 'Photography'],
			languages: [
				{ name: 'English', proficiency: 'Native' as const },
				{ name: 'French', proficiency: 'Intermediate' as const }
			]
		}

		const exportService = new ExportService()
		const docxBuffer = await exportService.generateDocx(sampleCV)
		
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
		res.setHeader('Content-Disposition', 'attachment; filename="TestCV_WithPhoto.docx"')
		res.send(docxBuffer)
		
	} catch (error: any) {
		console.error('Photo test error:', error)
		res.status(500).json({
			success: false,
			error: error.message || 'Photo test failed'
		})
	}
})

export default router;
