import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import XLSX from 'xlsx';
import sharp from 'sharp';
import { 
  ProcessedFile, 
  FileProcessingOptions, 
  SupportedFileType,
  FileValidationResult 
} from '../types';

export class FileProcessingService {
  private uploadPath: string;

  constructor() {
    // Save to project-root /uploads so it matches Express static path
    this.uploadPath = process.env.UPLOAD_PATH || path.resolve(__dirname, '..', '..', 'uploads');
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async validateFile(file: Express.Multer.File): Promise<FileValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file type
    const isSupportedType = Object.values(SupportedFileType).includes(file.mimetype as SupportedFileType);
    if (!isSupportedType) {
      errors.push(`Unsupported file type: ${file.mimetype}`);
    }

    // Check file size (10MB limit)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760');
    if (file.size > maxSize) {
      errors.push(`File size exceeds limit: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Check if file is empty
    if (file.size === 0) {
      errors.push('File is empty');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      supportedType: isSupportedType,
      sizeLimit: file.size <= maxSize
    };
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const safeName = (file.originalname || 'upload').replace(/[^a-zA-Z0-9_.-]/g, '') || 'upload';
    const filename = `${Date.now()}-${safeName}`;
    const filepath = path.join(this.uploadPath, filename);
    
    await fs.promises.writeFile(filepath, file.buffer);
    return filepath;
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.promises.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      throw new Error(`PDF text extraction failed: ${error}`);
    }
  }

  async extractTextFromDOCX(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new Error(`DOCX text extraction failed: ${error}`);
    }
  }

  async extractTextFromExcel(filePath: string): Promise<string> {
    try {
      const workbook = XLSX.readFile(filePath);
      let text = '';
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        jsonData.forEach((row: any) => {
          if (Array.isArray(row)) {
            text += row.join(' ') + '\n';
          }
        });
      });
      
      return text.trim();
    } catch (error) {
      throw new Error(`Excel text extraction failed: ${error}`);
    }
  }

  async extractTextFromFile(filePath: string, mimetype: string): Promise<string> {
    switch (mimetype) {
      case SupportedFileType.PDF:
        return this.extractTextFromPDF(filePath);
      case SupportedFileType.DOCX:
        return this.extractTextFromDOCX(filePath);
      case SupportedFileType.XLSX:
      case SupportedFileType.XLS:
        return this.extractTextFromExcel(filePath);
      default:
        throw new Error(`Unsupported file type: ${mimetype}`);
    }
  }

  async processImage(imageBuffer: Buffer, options: { width?: number; height?: number; quality?: number } = {}): Promise<Buffer> {
    try {
      let imageProcessor = sharp(imageBuffer);
      
      if (options.width || options.height) {
        imageProcessor = imageProcessor.resize(options.width, options.height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      if (options.quality) {
        imageProcessor = imageProcessor.jpeg({ quality: options.quality });
      }
      
      return await imageProcessor.toBuffer();
    } catch (error) {
      throw new Error(`Image processing failed: ${error}`);
    }
  }

  async extractImagesFromPDF(filePath: string): Promise<string[]> {
    try {
      // Simplified; return empty list
      await fs.promises.readFile(filePath);
      return [];
    } catch (error) {
      throw new Error(`PDF image extraction failed: ${error}`);
    }
  }

  async processFile(
    file: Express.Multer.File, 
    options: FileProcessingOptions = { extractText: true, extractImages: false, maintainFormatting: true }
  ): Promise<ProcessedFile> {
    try {
      const validation = await this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(`File validation failed: ${validation.errors.join(', ')}`);
      }

      const filepath = await this.saveFile(file);
      
      let extractedText: string | undefined;
      if (options.extractText) {
        extractedText = await this.extractTextFromFile(filepath, file.mimetype);
      }

      let extractedImages: string[] | undefined;
      if (options.extractImages && file.mimetype === SupportedFileType.PDF) {
        extractedImages = await this.extractImagesFromPDF(filepath);
      }

      const processedFile: ProcessedFile = {
        id: file.filename || Date.now().toString(),
        fileInfo: {
          id: file.filename || Date.now().toString(),
          originalName: file.originalname,
          filename: path.basename(filepath),
          mimetype: file.mimetype,
          size: file.size,
          path: filepath,
          url: `/uploads/${path.basename(filepath)}`,
          uploadedAt: new Date(),
          uploadedBy: 'system'
        },
        extractedText,
        extractedImages,
        metadata: {
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          processingOptions: options
        },
        processingErrors: []
      };

      return processedFile;
    } catch (error) {
      throw new Error(`File processing failed: ${error}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      throw new Error(`File deletion failed: ${error}`);
    }
  }
}
