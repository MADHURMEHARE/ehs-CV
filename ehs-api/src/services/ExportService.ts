import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun, Header, Footer, PageNumber, BorderStyle, TabStopType, TabStopPosition, TextWrappingType, Table, TableRow, TableCell, WidthType } from 'docx';
import { ProcessedCVData, Experience, Education } from '../types';
import sharp from 'sharp'

// Exact measurements from Client_FinalCV.pdf template
const CM_TO_TWIP = (cm: number) => Math.round((cm / 2.54) * 1440)
const PX_FROM_CM = (cm: number) => Math.round((cm / 2.54) * 96)

export class ExportService {
	// Exact font and color specifications from template
	private readonly defaultFont = 'Palatino Linotype'
	private readonly logoFont = 'Calibri (Body)' // Font for all logo text
	private readonly headingColor = 'DC2626' // EHS Red color for section headings
	private readonly nameColor = 'DC2626' // EHS Red for name heading
	private readonly headerFooterColor = '777777' // Exact gray from template
	private readonly borderColor = 'bfbfbf' // Exact border color from template
	
	// Exact font sizes (in half-points for docx)
	private readonly nameSize = 40 // 20pt
	private readonly titleSize = 28 // 14pt
	private readonly sectionHeadingSize = 26 // 13pt
	private readonly bodyTextSize = 22 // 11pt
	private readonly smallTextSize = 20 // 10pt
	private readonly logoTextSize = 22 // 11pt for logo text
	
	// Exact spacing measurements (in TWIPs)
	private readonly lineSpacing = 240 // Single line spacing
	private readonly paragraphSpacing = 120 // Space between paragraphs
	private readonly sectionSpacing = 200 // Space before sections
	private readonly bulletIndent = CM_TO_TWIP(1.5) // Exact bullet indent
	private readonly bulletHanging = CM_TO_TWIP(0.5) // Exact hanging indent
	
	// Exact page margins from template
	private readonly pageMargins = {
		top: CM_TO_TWIP(2.5),
		right: CM_TO_TWIP(2.0),
		bottom: CM_TO_TWIP(2.0),
		left: CM_TO_TWIP(2.0)
	}
	
	// Photo specifications from template
	private readonly photoSize = PX_FROM_CM(4.7) // Exact 4.7cm
	private readonly photoPosition = {
		x: CM_TO_TWIP(8.0), // Center position (page width is ~16cm, so center at 8cm)
		y: CM_TO_TWIP(1.5)   // Top position
	}

	private toShortMonthYear(input?: string): string {
		if (!input) return ''
		
		// Handle DD/MM/YYYY format (common in UK)
		if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(input)) {
			const [day, month, year] = input.split('/')
			const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
			if (!isNaN(date.getTime())) {
				return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
			}
		}
		
		// Handle MM/DD/YYYY format (common in US)
		if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(input)) {
			const [month, day, year] = input.split('/')
			const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
			if (!isNaN(date.getTime())) {
				return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
			}
		}
		
		// Handle standard date parsing
		const date = new Date(input)
		if (!isNaN(date.getTime())) {
			// Exact format from CVTemplate_Notes: "first 3 letters of the month"
			return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
		}
		
		// Handle text dates like "January 2020" -> "Jan 2020"
		return input.replace(/^(\w{3,})\s+(\d{4})/i, (_, month, year) => {
			const shortMonth = month.substring(0, 3)
			return `${shortMonth.charAt(0).toUpperCase()}${shortMonth.slice(1).toLowerCase()} ${year}`
		})
	}

	private toTitleCase(input?: string): string {
		if (!input) return ''
		return input
			.toLowerCase()
			.replace(/(^|[\s\-/])([a-z])/g, (_m, p1, p2) => `${p1}${(p2 as string).toUpperCase()}`)
	}

	private cleanupText(input?: string): string {
		if (!input) return ''
		let out = input.trim()
		// Exact content cleanup rules from CVTemplate_Notes.docx
		out = out.replace(/^\s*I\s+am\s+responsible\s+for\s*/i, 'Responsible for ')
		out = out.replace(/^\s*I\s+was\s+responsible\s+for\s*/i, 'Responsible for ')
		out = out.replace(/^\s*I\s+manage\s*/i, 'Manage ')
		out = out.replace(/^\s*in\s+this\s+role,\s*I\s*/i, 'I ')
		out = out.replace(/\bPrinciple\b/gi, 'Principal')
		out = out.replace(/\bLadies\s+Maid\b/gi, 'Lady\'s Maid')
		out = out.replace(/\bDiscrete\b/gi, 'Discreet')
		out = out.replace(/\bUpmost\b/gi, 'Utmost')
		out = out.replace(/\bI\s+have\s+experience\s+in\b/gi, 'Experience in ')
		out = out.replace(/\bI\s+am\s+skilled\s+in\b/gi, 'Skilled in ')
		return out
	}

	private async toSquarePortrait(buffer?: Buffer): Promise<Buffer | undefined> {
		if (!buffer || !buffer.length) return undefined
		const meta = await sharp(buffer).metadata()
		
		// Handle landscape→portrait conversion as per CVTemplate_Notes
		// "if the photo was originally landscape rather than portrait, you will need to change the size in the bottom box"
		let finalSize = this.photoSize
		if (meta.width && meta.height && meta.width > meta.height) {
			// Landscape photo - reduce size as per template notes
			// "you should be able to tell as the photo will look too large"
			finalSize = Math.round(this.photoSize * 0.75) // Reduce size for landscape conversion
		}
		
		const size = Math.min(meta.width || 0, meta.height || 0)
		if (!size) return buffer
		
		// Center crop to square
		const left = Math.max(0, Math.floor(((meta.width || size) - size) / 2))
		const top = Math.max(0, Math.floor(((meta.height || size) - size) / 2))
		
		// Resize to exact 4.7cm (or adjusted size for landscape) as specified in template
		return await sharp(buffer)
			.extract({ left, top, width: size, height: size })
			.resize(finalSize, finalSize)
			.toBuffer()
	}

		// Download photo from URL and convert to buffer
	private async downloadPhotoFromUrl(url: string): Promise<Buffer | undefined> {
		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error(`Failed to fetch photo: ${response.status} ${response.statusText}`)
		}
			const arrayBuffer = await response.arrayBuffer()
			return Buffer.from(arrayBuffer)
		} catch (error) {
			console.error('Error downloading photo from URL:', error)
			return undefined
		}
	}







	// Header styling with only company name text (no logo)
	private createHeader() {
		return new Header({
			children: [
				new Paragraph({
					spacing: { after: 80 },
					border: {
						bottom: {
							color: this.borderColor,
							size: 6,
							space: 1,
							style: BorderStyle.SINGLE
						}
					},
					children: [
						new TextRun({
							text: 'EXCLUSIVE HOUSEHOLD STAFF',
							size: 24,
							color: this.nameColor,
							font: this.defaultFont,
							bold: true
						})
					]
				})
			]
		})
	}

	// Create footer with contact information
	private createFooter(): Footer {
		return new Footer({
			children: [
				new Paragraph({
					spacing: { before: 200, after: 0 },
					alignment: AlignmentType.CENTER,
					children: [
						new TextRun({
							text: 'EHS — Exclusive Household Staff',
							size: 16,
							color: this.headerFooterColor,
							font: this.defaultFont
						}),
						new TextRun({
							text: '\n',
							break: 1
						}),
						new TextRun({
							text: 'Exclusive Household Staff & Nannies',
							size: 18,
							color: 'DC2626', // EHS Red
							font: this.defaultFont,
							bold: true
						}),
						new TextRun({
							text: '\n',
							break: 1
						}),
						new TextRun({
							text: 'www.exclusivehouseholdstaff.com',
							size: 16,
							color: this.headerFooterColor,
							font: this.defaultFont
						}),
						new TextRun({
							text: '\n',
							break: 1
						}),
						new TextRun({
							text: 'Telephone: +44 (0) 203 358 7000',
							size: 16,
							color: this.headerFooterColor,
							font: this.defaultFont
						})
					]
				})
			]
		})
	}

	// Exact name heading styling from template
	private createNameHeading(name: string) {
		return new Paragraph({
			spacing: { after: 100, line: this.lineSpacing },
			children: [
				new TextRun({
					text: name.toUpperCase(),
					bold: true,
					size: this.nameSize,
					color: this.nameColor,
					font: this.defaultFont
				})
			]
		})
	}

	// Exact job title styling from template
	private createJobTitle(title: string) {
		return new Paragraph({
			spacing: { after: 120, line: this.lineSpacing },
			children: [
				new TextRun({
					text: title,
					font: this.defaultFont,
					size: this.titleSize,
					color: '000000' // Black for job title
				})
			]
		})
	}

	// Exact section heading styling from template with EHS red color
	private createSectionHeading(text: string) {
		return new Paragraph({
			spacing: { before: this.sectionSpacing, after: 60, line: this.lineSpacing },
			children: [
				new TextRun({
					text: text.toUpperCase(),
					bold: true,
					size: this.sectionHeadingSize,
					color: this.headingColor, // EHS Red color
					font: this.defaultFont
				})
			]
		})
	}

	// Exact body paragraph styling from template
	private createBodyParagraph(text: string) {
		return new Paragraph({
			spacing: { after: this.paragraphSpacing, line: this.lineSpacing },
			children: [
				new TextRun({
					text: this.cleanupText(text),
					font: this.defaultFont,
					size: this.bodyTextSize
				})
			]
		})
	}

	// Exact bullet point styling from template
	private createBulletPoint(text: string) {
		return new Paragraph({
			bullet: { level: 0 },
			indent: {
				left: this.bulletIndent,
				hanging: this.bulletHanging
			},
			spacing: { after: 80, line: this.lineSpacing },
			children: [
				new TextRun({
					text: this.cleanupText(text),
					font: this.defaultFont,
					size: this.bodyTextSize
				})
			]
		})
	}

	// Exact experience item styling from template
	private createExperienceItem(exp: Experience) {
		const range = `${this.toShortMonthYear(exp.startDate)}${exp.endDate ? ' - ' + this.toShortMonthYear(exp.endDate) : ''}`
		
		return [
			new Paragraph({
				spacing: { after: 20, line: this.lineSpacing },
				children: [
					new TextRun({
						text: `${this.toTitleCase(exp.position)} — ${exp.company} (${range})`,
						bold: true,
						font: this.defaultFont,
						size: this.bodyTextSize,
						color: '000000'
					})
				]
			}),
			...(exp.description || []).map(d => this.createBulletPoint(d))
		]
	}

	// Exact education item styling from template
	private createEducationItem(edu: Education) {
		const range = `${this.toShortMonthYear(edu.startDate)} - ${this.toShortMonthYear(edu.endDate)}`
		
		return new Paragraph({
			spacing: { after: 20, line: this.lineSpacing },
			children: [
				new TextRun({
					text: `${edu.degree} — ${edu.institution} (${range})`,
					bold: true,
					font: this.defaultFont,
					size: this.bodyTextSize,
					color: '000000'
				})
			]
		})
	}



	// Create company header section with only text (no logo)
	private async createCompanyHeader(): Promise<Paragraph> {
		return new Paragraph({
			spacing: { after: 120, line: this.lineSpacing },
			alignment: AlignmentType.CENTER,
			children: [
				new TextRun({
					text: 'EXCLUSIVE HOUSEHOLD STAFF',
					size: this.logoTextSize,
					color: this.headerFooterColor,
					font: this.logoFont,
					allCaps: true
				})
			]
		})
	}

	// Create centered company text section for the middle of the CV (no logo)
	private async createCenteredLogoSection(): Promise<Paragraph> {
		return new Paragraph({
			spacing: { before: 200, after: 200, line: this.lineSpacing },
			alignment: AlignmentType.CENTER,
			children: [
				new TextRun({
					text: 'EXCLUSIVE HOUSEHOLD STAFF',
					size: this.logoTextSize,
					color: this.headerFooterColor,
					font: this.logoFont,
					allCaps: true
				})
			]
		})
	}

	// Generate DOCX CV matching Client_FinalCV.pdf exactly
	// File naming format from CVTemplate_Notes: "FirstName (Candidate BH No) Client CV"
	public async generateDocx(cv: ProcessedCVData, photoBuffer?: Buffer): Promise<Buffer> {
		const sections: (Paragraph | Table)[] = []

		// Create document sections in exact order from template
		
		// 0. EHS Company Header (at the very top)
		sections.push(await this.createCompanyHeader())

		// 3. Centered EHS Logo Section (in the middle of CV)
		sections.push(await this.createCenteredLogoSection())

		// 4. Photo Section (4.7cm with landscape/portrait handling)
		let photoData: Buffer | undefined = photoBuffer
		
		// If no photo buffer provided, try to download from photoUrl
		if (!photoData && cv.personalInfo?.photoUrl) {
			try {
				photoData = await this.downloadPhotoFromUrl(cv.personalInfo.photoUrl)
			} catch (error) {
				console.warn('Failed to download photo from URL:', error)
			}
		}
		
		if (photoData && photoData.length > 0) {
			const processedPhoto = await this.toSquarePortrait(photoData)
			if (processedPhoto) {
				sections.push(new Paragraph({
					spacing: { after: 120, line: this.lineSpacing },
					alignment: AlignmentType.CENTER,
					children: [
						new ImageRun({
							data: processedPhoto,
							transformation: {
								width: this.photoSize,
								height: this.photoSize
							}
						})
					]
				}))
			}
		}

		// 5. Name and Title Section
		sections.push(this.createNameHeading(`${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`.trim()))
		sections.push(this.createJobTitle(cv.personalInfo.jobTitle))



		// 6. Profile section
		sections.push(this.createSectionHeading('Profile'))
		sections.push(this.createBodyParagraph(cv.profile))

		// 7. Experience section
		sections.push(this.createSectionHeading('Experience'))
		;(cv.experience || []).forEach((exp: Experience) => {
			sections.push(...this.createExperienceItem(exp))
		})

		// 8. Education section
		sections.push(this.createSectionHeading('Education'))
		;(cv.education || []).forEach((edu: Education) => {
			sections.push(this.createEducationItem(edu))
		})

		// 9. Key Skills section
		sections.push(this.createSectionHeading('Key Skills'))
		;(cv.skills || []).forEach((skill: string) => {
			sections.push(this.createBulletPoint(skill))
		})

		// 10. Interests section
		sections.push(this.createSectionHeading('Interests'))
		;(cv.interests || []).forEach((interest: string) => {
			sections.push(this.createBulletPoint(interest))
		})

		// Create document with exact specifications from template
		const doc = new Document({
			sections: [{
				properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
				headers: { default: this.createHeader() },
				footers: { default: this.createFooter() },
				children: sections
			}],
			styles: {
				paragraphStyles: [
					{
						id: 'Normal',
						name: 'Normal',
						basedOn: 'Normal',
						run: {
							font: this.defaultFont,
							size: this.bodyTextSize
						}
					}
				]
			}
		})

		return await Packer.toBuffer(doc)
	}
}
