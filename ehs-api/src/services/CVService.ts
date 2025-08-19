import { CV } from '../models/CV';
import { AIAgentService } from './AIAgentService';
import { FileProcessingService } from './FileProcessingService';
import { FormattingRulesService } from './FormattingRulesService';
import { EmbeddingService } from './EmbeddingService';
import { HeuristicParserService } from './HeuristicParserService';
import { 
	CVData, 
	ProcessedCVData, 
	CVStatus, 
	ApiResponse,
	ProcessingStatus 
} from '../types';
import mongoose from 'mongoose';

export class CVService {
	private aiAgentService: AIAgentService;
	private fileProcessingService: FileProcessingService;
	private formattingRulesService: FormattingRulesService;
	private embeddingService: EmbeddingService;
	private heuristicParser: HeuristicParserService;

	constructor() {
		this.aiAgentService = new AIAgentService();
		this.fileProcessingService = new FileProcessingService();
		this.formattingRulesService = new FormattingRulesService();
		this.embeddingService = new EmbeddingService();
		this.heuristicParser = new HeuristicParserService();
	}

	private emptyProcessed(): ProcessedCVData {
		return {
			personalInfo: { firstName: '', lastName: '', jobTitle: '', photoUrl: '', nationality: '', dateOfBirth: '', maritalStatus: '', email: '', phone: '', address: '' },
			profile: '',
			experience: [],
			education: [],
			skills: [],
			interests: [],
			languages: [],
			certifications: []
		};
	}

	async createCV(userId: string, file: Express.Multer.File): Promise<ApiResponse<CVData>> {
		try {
			const processedFile = await this.fileProcessingService.processFile(file, { extractText: true, extractImages: true, maintainFormatting: true });

			const cv = await CV.create({
				userId: new mongoose.Types.ObjectId(userId),
				originalFileName: file.originalname,
				originalFileUrl: processedFile.fileInfo.url,
				status: CVStatus.UPLOADED
			});

			const cvIdStr = String((cv as any)._id);
			this.processCVWithAI(cvIdStr, processedFile.extractedText || '');

			return { success: true, data: cv.toObject() as CVData, message: 'CV uploaded successfully. Processing started.', timestamp: new Date() };
		} catch (error) {
			return { success: false, error: `Failed to create CV: ${error}`, timestamp: new Date() };
		}
	}

	private async processCVWithAI(cvId: string, extractedText: string): Promise<void> {
		try {
			await CV.findByIdAndUpdate(cvId, { status: CVStatus.PROCESSING });

			let processedData: ProcessedCVData | null = null;
			try {
				const parsedData = await this.aiAgentService.convertToStructuredData(extractedText);
				const adjustedData = await this.aiAgentService.compareAndAdjustContent(parsedData.structuredData, {});
				const formattedData = await this.aiAgentService.applyFormattingStandards(adjustedData.formattedData, {});
				processedData = this.transformAIResultsToCVData({ parsedData, formattedData });
			} catch (e) {
				if (extractedText && extractedText.trim().length > 0) {
					processedData = this.heuristicParser.parse(extractedText);
				}
			}

			processedData = processedData || this.emptyProcessed();
			processedData = this.formattingRulesService.applyRules(processedData);

			await CV.findByIdAndUpdate(cvId, { processedData, status: CVStatus.PROCESSED });
		} catch (error) {
			await CV.findByIdAndUpdate(cvId, { status: CVStatus.REJECTED });
		}
	}

	private transformAIResultsToCVData(aiResults: any): ProcessedCVData {
		const { parsedData, formattedData } = aiResults;
		return {
			personalInfo: {
				firstName: parsedData?.structuredData?.firstName || '',
				lastName: parsedData?.structuredData?.lastName || '',
				jobTitle: parsedData?.structuredData?.jobTitle || '',
				photoUrl: parsedData?.structuredData?.photoUrl || '',
				nationality: parsedData?.structuredData?.nationality || '',
				dateOfBirth: parsedData?.structuredData?.dateOfBirth || '',
				maritalStatus: parsedData?.structuredData?.maritalStatus || '',
				email: parsedData?.structuredData?.email || '',
				phone: parsedData?.structuredData?.phone || '',
				address: parsedData?.structuredData?.address || ''
			},
			profile: formattedData?.formattedData?.profile || '',
			experience: formattedData?.formattedData?.experience || [],
			education: formattedData?.formattedData?.education || [],
			skills: formattedData?.formattedData?.skills || [],
			interests: formattedData?.formattedData?.interests || [],
			languages: formattedData?.formattedData?.languages || [],
			certifications: formattedData?.formattedData?.certifications || []
		};
	}

	async getCVById(cvId: string): Promise<ApiResponse<CVData>> {
		try {
			const cv = await CV.findById(cvId).populate('userId', 'firstName lastName email');
			if (!cv) return { success: false, error: 'CV not found', timestamp: new Date() };
			return { success: true, data: cv.toObject() as CVData, timestamp: new Date() };
		} catch (error) {
			return { success: false, error: `Failed to retrieve CV: ${error}`, timestamp: new Date() };
		}
	}

	async getUserCVs(userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<CVData[]>> {
		try {
			const skip = (page - 1) * limit;
			const cvs = await CV.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'firstName lastName email');
			return { success: true, data: cvs.map(cv => cv.toObject() as CVData), message: `Retrieved ${cvs.length} CVs`, timestamp: new Date() };
		} catch (error) {
			return { success: false, error: `Failed to retrieve CVs: ${error}`, timestamp: new Date() };
		}
	}

	async updateCV(cvId: string, updateData: Partial<ProcessedCVData>): Promise<ApiResponse<CVData>> {
		try {
			const cv = await CV.findByIdAndUpdate(cvId, { processedData: updateData, status: CVStatus.PROCESSED, updatedAt: new Date() }, { new: true });
			if (!cv) return { success: false, error: 'CV not found', timestamp: new Date() };
			return { success: true, data: cv.toObject() as CVData, message: 'CV updated successfully', timestamp: new Date() };
		} catch (error) {
			return { success: false, error: `Failed to update CV: ${error}`, timestamp: new Date() };
		}
	}

	async approveCV(cvId: string, approvedBy: string): Promise<ApiResponse<CVData>> {
		try {
			const cv = await CV.findByIdAndUpdate(cvId, { status: CVStatus.APPROVED, approvedAt: new Date(), approvedBy: new mongoose.Types.ObjectId(approvedBy) }, { new: true });
			if (!cv) return { success: false, error: 'CV not found', timestamp: new Date() };
			const textBlob = this.flattenCVToText(cv.processedData as any);
			if (textBlob.trim()) {
				const cvIdStr = String((cv as any)._id);
				await this.embeddingService.upsertEmbedding(cvIdStr, (cv.userId as any).toString(), textBlob);
			}
			return { success: true, data: cv.toObject() as CVData, message: 'CV approved successfully', timestamp: new Date() };
		} catch (error) {
			return { success: false, error: `Failed to approve CV: ${error}`, timestamp: new Date() };
		}
	}

	async deleteCV(cvId: string): Promise<ApiResponse<void>> {
		try {
			const cv = await CV.findById(cvId);
			if (!cv) return { success: false, error: 'CV not found', timestamp: new Date() } as any;
			await CV.findByIdAndDelete(cvId);
			return { success: true, message: 'CV deleted successfully', timestamp: new Date() } as any;
		} catch (error) {
			return { success: false, error: `Failed to delete CV: ${error}`, timestamp: new Date() };
		}
	}

	async getProcessingStatus(cvId: string): Promise<ProcessingStatus> {
		const cv = await CV.findById(cvId);
		if (!cv) throw new Error('CV not found');
		let progress = 0; let currentStep = '';
		switch (cv.status) {
			case CVStatus.UPLOADED: progress = 20; currentStep = 'File uploaded, starting AI processing'; break;
			case CVStatus.PROCESSING: progress = 60; currentStep = 'AI agents processing CV content'; break;
			case CVStatus.PROCESSED: progress = 90; currentStep = 'CV processed, ready for review'; break;
			case CVStatus.APPROVED: progress = 100; currentStep = 'CV approved and finalized'; break;
			case CVStatus.REJECTED: progress = 0; currentStep = 'Processing failed'; break;
		}
		return { id: cvId, status: cv.status, progress, currentStep, errors: cv.status === CVStatus.REJECTED ? ['Processing failed'] : undefined };
	}

	private flattenCVToText(cv: ProcessedCVData): string {
		if (!cv) return '';
		const lines: string[] = [];
		const pi = cv.personalInfo || { firstName: '', lastName: '', jobTitle: '' } as any;
		lines.push(`${pi.firstName || ''} ${pi.lastName || ''}`.trim());
		lines.push(pi.jobTitle || '');
		lines.push(cv.profile || '');
		(cv.experience || []).forEach(e => { lines.push(`${e.position || ''} ${e.company || ''} ${e.startDate || ''} ${e.endDate || ''}`.trim()); (e.description || []).forEach(d => lines.push(d)); });
		(cv.education || []).forEach(e => lines.push(`${e.degree || ''} ${e.institution || ''} ${e.startDate || ''}-${e.endDate || ''}`.trim()));
		(cv.skills || []).forEach(s => lines.push(s));
		(cv.interests || []).forEach(i => lines.push(i));
		return lines.filter(Boolean).join('\n');
	}
}
