import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

const router = Router();

const signToken = (userId: string) => jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
const signResetToken = (userId: string) => jwt.sign({ userId, type: 'reset' }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '30m' });

// Register (name + email; password optional)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !firstName || !lastName) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    let user = await UserModel.findOne({ email });
    if (user) return res.status(400).json({ success: false, error: 'Email already in use' });
    user = await UserModel.create({ 
      email, 
      password: password || undefined, 
      firstName, 
      lastName
    });
    const token = signToken((user as any)._id.toString());
    res.status(201).json({ 
      success: true, 
      data: { 
        user: { 
          id: (user as any)._id, 
          email, 
          firstName, 
          lastName, 
          role: user.role
        }, 
        token 
      }, 
      timestamp: new Date() 
    });
  } catch (error) { res.status(500).json({ success: false, error: `Registration failed: ${error}` }); }
});

// Login email-only
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ success: false, error: 'Account not found' });
    const token = signToken((user as any)._id.toString());
    await UserModel.findByIdAndUpdate((user as any)._id, { lastLoginAt: new Date() });
    res.json({ success: true, data: { user: { id: (user as any)._id, email, firstName: user.firstName, lastName: user.lastName, role: user.role }, token }, timestamp: new Date() });
  } catch (error) { res.status(500).json({ success: false, error: `Login failed: ${error}` }); }
});

// Forgot password - generate reset token (send via email in production; here return in response for demo)
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'Account not found' });
    const resetToken = signResetToken((user as any)._id.toString());
    await UserModel.findByIdAndUpdate((user as any)._id, { resetPasswordToken: resetToken, resetPasswordExpires: new Date(Date.now() + 30*60*1000) });
    // In real app, email the link `${CLIENT_URL}/reset-password?token=${resetToken}`
    res.json({ success: true, data: { resetToken }, message: 'Password reset token generated', timestamp: new Date() });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to create reset token' }); }
});

// Reset password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ success: false, error: 'Missing token or password' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    if (payload?.type !== 'reset') return res.status(400).json({ success: false, error: 'Invalid token' });
    const user = await UserModel.findById(payload.userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    // @ts-ignore
    user.password = newPassword;
    // @ts-ignore
    user.resetPasswordToken = undefined; user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (e) { res.status(400).json({ success: false, error: 'Invalid or expired token' }); }
});

export default router;
