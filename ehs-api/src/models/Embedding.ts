import mongoose, { Schema, Document } from 'mongoose';

export interface EmbeddingDocument extends Document {
	cvId: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	vector: number[];
	createdAt: Date;
}

const EmbeddingSchema = new Schema<EmbeddingDocument>({
	cvId: { type: Schema.Types.ObjectId, ref: 'CV', required: true },
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	vector: { type: [Number], required: true, index: '2dsphere' },
}, { timestamps: { createdAt: true, updatedAt: false } });

EmbeddingSchema.index({ userId: 1, cvId: 1 });

export const EmbeddingModel = mongoose.model<EmbeddingDocument>('Embedding', EmbeddingSchema);
