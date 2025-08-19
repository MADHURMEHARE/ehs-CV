import axios from 'axios';
import { EmbeddingModel } from '../models/Embedding';

export class EmbeddingService {
	private openaiKey?: string;
	constructor() {
		this.openaiKey = process.env.OPENAI_API_KEY;
	}

	async embedText(text: string): Promise<number[]> {
		if (!this.openaiKey) {
			// Simple fallback: hash chars to numbers (not semantic). Replace with real embeddings when key is present.
			const vec = new Array(128).fill(0);
			for (let i = 0; i < text.length; i++) vec[i % 128] += text.charCodeAt(i) / 255;
			return vec;
		}
		const resp = await axios.post('https://api.openai.com/v1/embeddings', {
			model: 'text-embedding-3-small',
			input: text,
		}, { headers: { Authorization: `Bearer ${this.openaiKey}` } });
		return resp.data.data[0].embedding;
	}

	async upsertEmbedding(cvId: string, userId: string, text: string) {
		const vector = await this.embedText(text);
		await EmbeddingModel.findOneAndUpdate(
			{ cvId, userId },
			{ vector },
			{ upsert: true }
		);
	}

	async findSimilar(vector: number[], topK: number = 5) {
		// Naive cosine similarity over small set
		const all = await EmbeddingModel.find({}).limit(500);
		const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * (b[i] || 0), 0);
		const norm = (a: number[]) => Math.sqrt(a.reduce((s, v) => s + v * v, 0));
		const nn = norm(vector) || 1;
		const scored = all.map((doc) => {
			const score = dot(vector, doc.vector) / (nn * (norm(doc.vector) || 1));
			return { id: doc._id, cvId: doc.cvId, userId: doc.userId, score };
		});
		return scored.sort((a, b) => b.score - a.score).slice(0, topK);
	}
}
