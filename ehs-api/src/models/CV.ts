import mongoose, { Schema, Document } from 'mongoose';
import { CVData, CVStatus } from '../types';

export type CVDocument = Document & Omit<CVData, 'id'>;

const PersonalInfoSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	jobTitle: { type: String, required: true },
	photoUrl: { type: String },
	nationality: { type: String, required: true },
	dateOfBirth: { type: String, required: true },
	maritalStatus: { type: String, required: true },
	email: { type: String },
	phone: { type: String },
	address: { type: String }
});

const ExperienceSchema = new Schema({
	company: { type: String, required: true },
	position: { type: String, required: true },
	startDate: { type: String, required: true },
	endDate: { type: String },
	current: { type: Boolean, default: false },
	description: [{ type: String }],
	achievements: [{ type: String }]
});

const EducationSchema = new Schema({
	institution: { type: String, required: true },
	degree: { type: String, required: true },
	field: { type: String, required: true },
	startDate: { type: String, required: true },
	endDate: { type: String, required: true },
	gpa: { type: String }
});

const LanguageSchema = new Schema({
	name: { type: String, required: true },
	proficiency: { 
		type: String, 
		enum: ['Basic', 'Intermediate', 'Advanced', 'Native'],
		required: true 
	}
});

const ProcessedCVDataSchema = new Schema({
	personalInfo: { type: PersonalInfoSchema, required: true },
	profile: { type: String, required: true },
	experience: [{ type: ExperienceSchema }],
	education: [{ type: EducationSchema }],
	skills: [{ type: String }],
	interests: [{ type: String }],
	languages: [{ type: LanguageSchema }],
	certifications: [{ type: String }]
});

const RegistrationFormSchema = new Schema({
	title: { type: String },
	firstName: { type: String },
	lastName: { type: String },
	pronouns: { type: String },
	maritalStatus: { type: String },
	jobTitle: { type: String },
	dateOfBirth: { type: String },
	email: { type: String },
	phone: { type: String },
	address: { type: String },
	desiredSalary: { type: String },
	nationality: { type: String },
	languages: { type: String },
	utr: { type: String },
	currentDBS: { type: String },
	criminalRecord: { type: String },
	drivingLicence: { type: String },
	licenceClean: { type: String },
	happyWithPets: { type: String },
	ownPets: { type: String },
	preferredLocation: { type: String },
	willingToTravel: { type: String },
	noticePeriod: { type: String },
	liveInOrOut: { type: String },
	gender: { type: String },
	rightToWork: { type: String },
	shareCodeStatus: { type: String },
	dependants: { type: String },
	niNumber: { type: String },
	smokeVape: { type: String },
	emergencyName: { type: String },
	emergencyPhone: { type: String },
	emergencyRelation: { type: String },
	certified: { type: Boolean, default: false },
	dated: { type: String }
});

const CVSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	originalFileName: { type: String, required: false },
	originalFileUrl: { type: String, required: false },
	processedData: { type: ProcessedCVDataSchema, required: false },
	registrationForm: { type: RegistrationFormSchema },
	status: { 
		type: String, 
		enum: Object.values(CVStatus), 
		default: CVStatus.UPLOADED 
	},
	approvedAt: { type: Date },
	approvedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
	timestamps: true
});

CVSchema.index({ userId: 1, status: 1 });
CVSchema.index({ status: 1, createdAt: -1 });
CVSchema.index({ approvedAt: -1 });

export const CV = mongoose.model<CVDocument>('CV', CVSchema);
