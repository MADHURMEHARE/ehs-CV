import { ProcessedCVData } from '../types';

export class FormattingRulesService {
	// Apply deterministic cleanup rules in addition to AI formatting
	applyRules(cv: ProcessedCVData): ProcessedCVData {
		const clone: ProcessedCVData = JSON.parse(JSON.stringify(cv));

		// Job title capitalization (Title Case first letter)
		if (clone.personalInfo?.jobTitle) {
			clone.personalInfo.jobTitle = this.capitalizeEachWord(clone.personalInfo.jobTitle);
		}

		// Date format: short month (Jan 2020)
		const reformatDate = (value?: string) => (value ? this.toShortMonthYear(value) : value);
		clone.experience = (clone.experience || []).map((e) => ({
			...e,
			startDate: reformatDate(e.startDate) || '',
			endDate: reformatDate(e.endDate) || e.endDate,
		}));
		clone.education = (clone.education || []).map((e) => ({
			...e,
			startDate: reformatDate(e.startDate) || '',
			endDate: reformatDate(e.endDate) || '',
		}));

		// Cleanup phrases
		const replacements: Array<[RegExp, string]> = [
			[/\bI am responsible for\b/gi, 'Responsible for'],
			[/\bI was responsible for\b/gi, 'Responsible for'],
			[/\bPrinciple\b/g, 'Principal'],
			[/\bDiscrete\b/g, 'Discreet'],
		];

		const cleanLine = (line: string) => {
			let out = line.trim();
			replacements.forEach(([r, s]) => (out = out.replace(r, s)));
			return out;
		};

		clone.experience = (clone.experience || []).map((e) => ({
			...e,
			description: (e.description || []).map(cleanLine),
			achievements: (e.achievements || []).map(cleanLine),
		}));

		// Remove inappropriate fields
		clone.personalInfo = {
			...clone.personalInfo,
			dateOfBirth: '', // remove DOB per privacy
		} as any;

		return clone;
	}

	private toShortMonthYear(input: string): string {
		// Try to parse and format as "Mon YYYY"
		const date = new Date(input);
		if (!isNaN(date.getTime())) {
			return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
		}
		// Fallback: regex replace long month names
		return input
			.replace(/January|Jan/gi, 'Jan')
			.replace(/February|Feb/gi, 'Feb')
			.replace(/March|Mar/gi, 'Mar')
			.replace(/April|Apr/gi, 'Apr')
			.replace(/May/gi, 'May')
			.replace(/June|Jun/gi, 'Jun')
			.replace(/July|Jul/gi, 'Jul')
			.replace(/August|Aug/gi, 'Aug')
			.replace(/September|Sep|Sept/gi, 'Sep')
			.replace(/October|Oct/gi, 'Oct')
			.replace(/November|Nov/gi, 'Nov')
			.replace(/December|Dec/gi, 'Dec');
	}

	private capitalizeEachWord(input: string): string {
		return input
			.split(/\s+/)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(' ');
	}
}
