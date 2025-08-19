import axios from 'axios';
import { OCRResult, ParsedCVData, FormattingResult, QAResult, AgentConfig } from '../types';

export class AIAgentService {
	private agentConfig: AgentConfig;
	private baseUrl: string;

	constructor() {
		this.agentConfig = {
			agentId: process.env.AGENT_ID || 'ag:4751e733:20250818:untitled-agent:a08b6c38',
			apiKey: process.env.API_KEY || 's8W1Cslfszk8uEZzZD1xjZgmOwKffOpa'
		};
		this.baseUrl = process.env.AGENT_BASE_URL || 'https://api.agent.com';
	}

	private async callUnified(task: string, payload: Record<string, any>): Promise<any> {
		const base = (this.baseUrl || '').replace(/\/+$/, '')
		const withAgents = base.endsWith('/agents') ? base : `${base}/agents`
		const url = `${withAgents}/${encodeURIComponent(this.agentConfig.agentId)}/invoke`;
		const res = await axios.post(url, { task, ...payload }, {
			headers: { Authorization: `Bearer ${this.agentConfig.apiKey}`, 'Content-Type': 'application/json' }
		});
		return res.data;
	}

	async extractTextFromImage(imageBuffer: Buffer): Promise<OCRResult> {
		const data = await this.callUnified('ocr', { image_base64: imageBuffer.toString('base64') });
		return { text: data.text, confidence: data.confidence || 1, boundingBoxes: data.bounding_boxes };
	}

	async convertToStructuredData(rawText: string): Promise<ParsedCVData> {
		const data = await this.callUnified('parse_cv', { text: rawText });
		return { rawText, structuredData: data.parsed_data, confidence: data.confidence || 1, processingErrors: data.errors };
	}

	async compareAndAdjustContent(originalData: any, intakeFormData: any): Promise<FormattingResult> {
		const data = await this.callUnified('compare_intake', { original_data: originalData, intake_form: intakeFormData });
		return { formattedData: data.adjusted_data, appliedRules: data.applied_rules || [], validationErrors: data.validation_errors, suggestions: data.suggestions };
	}

	async applyFormattingStandards(cvData: any, template: any): Promise<FormattingResult> {
		const data = await this.callUnified('format_cv', { cv_data: cvData, template });
		return { formattedData: data.formatted_cv, appliedRules: data.applied_rules || [], validationErrors: data.errors, suggestions: data.suggestions };
	}

	async performQualityAssurance(formattedCV: any): Promise<QAResult> {
		const data = await this.callUnified('qa', { cv_data: formattedCV });
		return { score: data.qa_score || 0, issues: data.issues || [], recommendations: data.recommendations || [], passed: (data.qa_score || 0) >= 0.8 };
	}

	async processCV(imageBuffer: Buffer, intakeFormData?: any, template?: any) {
		const ocrResult = await this.extractTextFromImage(imageBuffer);
		const parsedData = await this.convertToStructuredData(ocrResult.text);
		const adjustedData = await this.compareAndAdjustContent(parsedData.structuredData, intakeFormData || {});
		const formattedData = await this.applyFormattingStandards(adjustedData.formattedData, template || {});
		const qaResult = await this.performQualityAssurance(formattedData.formattedData);
		return { ocrResult, parsedData, formattedData, qaResult };
	}
}
