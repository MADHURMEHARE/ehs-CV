import { ProcessedCVData, Experience, Education } from '../types'

const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']

export class HeuristicParserService {
	parse(raw: string): ProcessedCVData {
		const text = (raw || '').replace(/\r/g, '')
		const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean)

		// Identify sections by keywords
		const idx = (kw: RegExp) => lines.findIndex(l => kw.test(l.toLowerCase()))
		const iProfile = idx(/profile|summary/)
		const iExp = idx(/experience|employment|work history/)
		const iEdu = idx(/education|qualifications/)
		const iSkills = idx(/skills|competencies|key skills/)
		const iInterests = idx(/interests|hobbies/)

		const section = (start: number, end: number) => start >= 0 ? lines.slice(start + 1, end > start ? end : undefined) : []

		const profile = section(iProfile, Math.min(...[iExp,iEdu,iSkills,iInterests].filter(v => v>iProfile))) .join('\n')

		const expLines = section(iExp, Math.min(...[iEdu,iSkills,iInterests].filter(v => v>iExp)))
		const experiences: Experience[] = []
		let cur: Partial<Experience> | null = null
		const dateRe = new RegExp(`(${MONTHS.join('|')})[a-z]*\s*\d{2,4}`, 'i')
		expLines.forEach((l, idx) => {
			if (!l) return
			// New role line likely contains a dash and possibly dates
			if (/—|-/.test(l)) {
				if (cur) experiences.push(this.finishExp(cur))
				cur = { id: `${experiences.length}`, company: '', position: '', current: false, description: [], achievements: [] }
				// Split on dash
				const parts = l.split(/—|-/)
				if (parts.length >= 2) {
					cur.position = parts[0].trim()
					cur.company = parts[1].trim()
				}
				const m = l.match(new RegExp(`(${MONTHS.join('|')}).*\d{2,4}.*(\-|to).*(${MONTHS.join('|')}).*\d{2,4}|(${MONTHS.join('|')}).*\d{2,4}`, 'i'))
				if (m) {
					const range = l.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{2,4}/ig) || []
					cur.startDate = range[0] || ''
					cur.endDate = range[1] || ''
					cur.current = /present|current/i.test(l)
				}
			} else if (/^[•\-]/.test(l)) {
				cur = cur || { id: `${experiences.length}`, company: '', position: '', current: false, description: [], achievements: [] }
				cur.description = cur.description || []
				cur.description.push(l.replace(/^[•\-]\s*/, ''))
			} else {
				// Continuation
				if (cur) {
					cur.description = cur.description || []
					cur.description.push(l)
				}
			}
		})
		if (cur) experiences.push(this.finishExp(cur))

		const eduLines = section(iEdu, Math.min(...[iSkills,iInterests].filter(v => v>iEdu)))
		const educations: Education[] = []
		eduLines.forEach((l, idx) => {
			const parts = l.split(/—|-/)
			if (parts.length >= 2) {
				const degree = parts[0].trim()
				const rest = parts.slice(1).join('—').trim()
				const dates = rest.match(/\b\d{4}\b/g) || []
				const institution = rest.replace(/\b\d{4}\b/g, '').trim()
				educations.push({ id: `${educations.length}`, degree, institution, field: '', startDate: dates[0] || '', endDate: dates[1] || '' })
			}
		})

		const skills = section(iSkills, Math.min(...[iInterests,iEdu,iExp].filter(v=>v>iSkills))).join(',').split(/[,•\n]+/).map(s=>s.trim()).filter(Boolean)
		const interests = section(iInterests, Math.min(...[iSkills].filter(v=>v>iInterests))).join(',').split(/[,•\n]+/).map(s=>s.trim()).filter(Boolean)

		// Attempt name from first line
		const nameLine = lines[0] || ''
		const [firstName='', lastName=''] = nameLine.split(/\s+/)

		return {
			personalInfo: { firstName, lastName, jobTitle: '', nationality: '', dateOfBirth: '', maritalStatus: '', email: '', phone: '', address: '' },
			profile,
			experience: experiences,
			education: educations,
			skills,
			interests,
			languages: [],
			certifications: []
		}
	}

	private finishExp(cur: Partial<Experience>): Experience {
		return {
			id: String(cur.id || ''),
			company: cur.company || '',
			position: cur.position || '',
			startDate: cur.startDate || '',
			endDate: cur.endDate,
			current: !!cur.current,
			description: cur.description || [],
			achievements: cur.achievements || []
		}
	}
}
