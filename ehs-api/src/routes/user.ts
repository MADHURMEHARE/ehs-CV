import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { UserModel } from '../models/User';

const router = Router();

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
	try {
		const user = req.user;
		res.json({ success: true, data: user, timestamp: new Date() });
	} catch (error) {
		res.status(500).json({ success: false, error: `Failed to fetch user: ${error}` });
	}
});

// Dev helper: promote current user to reviewer using a promo code
router.post('/promote', authMiddleware, async (req: Request, res: Response) => {
	try {
		const { code } = req.body || {};
		const expected = process.env.ADMIN_PROMO_CODE || 'ehs-dev';
		if (!code || code !== expected) {
			return res.status(403).json({ success: false, error: 'Invalid promotion code' });
		}
		await UserModel.findByIdAndUpdate((req.user as any)._id, { role: 'reviewer' });
		res.json({ success: true, message: 'Promoted to reviewer', timestamp: new Date() });
	} catch (error) {
		res.status(500).json({ success: false, error: `Failed to promote: ${error}` });
	}
});

export default router;
