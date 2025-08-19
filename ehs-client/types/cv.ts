export interface PersonalInfo {
	firstName: string
	lastName: string
	jobTitle: string
	photoUrl?: string
	nationality: string
	dateOfBirth: string
	maritalStatus: string
	email?: string
	phone?: string
	address?: string
}

export interface Experience {
	id: string
	company: string
	position: string
	startDate: string
	endDate?: string
	current: boolean
	description: string[]
	achievements: string[]
}

export interface Education {
	id: string
	institution: string
	degree: string
	field: string
	startDate: string
	endDate: string
	gpa?: string
}

export interface Language {
	name: string
	proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native'
}

export interface ProcessedCVData {
	personalInfo: PersonalInfo
	profile: string
	experience: Experience[]
	education: Education[]
	skills: string[]
	interests: string[]
	languages: Language[]
	certifications?: string[]
}

export interface CVData {
	_id: string
	userId: any
	originalFileName: string
	originalFileUrl: string
	processedData: ProcessedCVData
	status: 'uploaded' | 'processing' | 'processed' | 'approved' | 'rejected'
	createdAt: string
	updatedAt: string
	approvedAt?: string
	approvedBy?: string
}
