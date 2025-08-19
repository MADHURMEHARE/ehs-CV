export interface FileInfo {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface FileProcessingOptions {
  extractText: boolean;
  extractImages: boolean;
  maintainFormatting: boolean;
  language?: string;
}

export interface ProcessedFile {
  id: string;
  fileInfo: FileInfo;
  extractedText?: string;
  extractedImages?: string[];
  metadata: any;
  processingErrors?: string[];
}

export enum SupportedFileType {
  PDF = 'application/pdf',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS = 'application/vnd.ms-excel',
  DOC = 'application/msword'
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  supportedType: boolean;
  sizeLimit: boolean;
}
