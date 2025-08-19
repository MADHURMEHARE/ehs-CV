import mongoose, { Schema, Document } from 'mongoose';
import { User, UserRole } from '../types';
import bcrypt from 'bcryptjs';

export type UserDocument = Document & Omit<User, 'id'> & {
	comparePassword(candidatePassword: string): Promise<boolean>;
};

const UserSchema = new Schema({
	email: { 
		type: String, 
		required: true, 
		unique: true,
		lowercase: true,
		trim: true
	},
	password: { 
		type: String, 
		required: false,
		minlength: 6
	},
	firstName: { 
		type: String, 
		required: true,
		trim: true
	},
	lastName: { 
		type: String, 
		required: true,
		trim: true
	},
	role: { 
		type: String, 
		enum: Object.values(UserRole), 
		default: UserRole.USER 
	},
	isActive: { 
		type: Boolean, 
		default: true 
	},
	lastLoginAt: { type: Date },
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date },
	// registrationCompleted field removed - no restrictions
}, {
	timestamps: true
});

UserSchema.pre('save', async function(next) {
	// Only hash if password present and modified
	// @ts-ignore
	if (!this.password || !this.isModified('password')) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		// @ts-ignore
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error as Error);
	}
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
	// @ts-ignore
	if (!this.password) return false;
	// @ts-ignore
	return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ role: 1, isActive: 1 });

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
