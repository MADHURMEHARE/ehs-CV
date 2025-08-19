export interface AIAgent {
  id: string;
  name: string;
  description: string;
  model: string;
  apiKey: string;
  isActive: boolean;
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  processingTime?: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes?: any[];
}

export interface ParsedCVData {
  rawText: string;
  structuredData: any;
  confidence: number;
  processingErrors?: string[];
}

export interface FormattingResult {
  formattedData: any;
  appliedRules: string[];
  validationErrors?: string[];
  suggestions?: string[];
}

export interface QAResult {
  score: number;
  issues: string[];
  recommendations: string[];
  passed: boolean;
}

export interface AgentConfig {
  agentId: string;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}
