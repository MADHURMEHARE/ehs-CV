export interface CVData {
  id: string;
  userId: string;
  originalFileName: string;
  originalFileUrl: string;
  processedData: ProcessedCVData;
  status: CVStatus;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  registrationForm?: RegistrationForm;
}

export interface RegistrationForm {
  title?: string;
  firstName?: string;
  lastName?: string;
  pronouns?: string;
  maritalStatus?: string;
  jobTitle?: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  address?: string;
  desiredSalary?: string;
  nationality?: string;
  languages?: string;
  utr?: string;
  currentDBS?: string;
  criminalRecord?: string;
  drivingLicence?: string;
  licenceClean?: string;
  happyWithPets?: string;
  ownPets?: string;
  preferredLocation?: string;
  willingToTravel?: string;
  noticePeriod?: string;
  liveInOrOut?: string;
  gender?: string;
  rightToWork?: string;
  shareCodeStatus?: string;
  dependants?: string;
  niNumber?: string;
  smokeVape?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  certified?: boolean;
  dated?: string;
}

export interface ProcessedCVData {
  personalInfo: PersonalInfo;
  profile: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  interests: string[];
  languages: Language[];
  certifications?: string[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  photoUrl?: string;
  nationality: string;
  dateOfBirth: string;
  maritalStatus: string;
  email?: string;
  phone?: string;
  address?: string;
  nonSmoker?: boolean;
  drivingLicence?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Language {
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
}

export enum CVStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  templateData: any;
  isActive: boolean;
  createdAt: Date;
}
