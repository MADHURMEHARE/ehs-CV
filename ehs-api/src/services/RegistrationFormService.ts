import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, Header, Footer, ImageRun } from 'docx';
import fs from 'fs';
import path from 'path';

export class RegistrationFormService {
	private readonly font = 'Palatino Linotype'
	private readonly rowHeight = 320 // ~0.23"
	private readonly labelFill = 'f2f2f2'
	private readonly borderColor = 'bfbfbf'

	private title(text: string) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [ new TextRun({ text, bold: true, size: 30, font: this.font }) ] }) }
	private cell(text: string, bold = false) { return new Paragraph({ spacing: { before: 0, after: 0 }, children: [ new TextRun({ text, bold, font: this.font, size: 22 }) ] }) }
	private borders() { return { top: { style: BorderStyle.SINGLE, size: 2, color: this.borderColor }, bottom: { style: BorderStyle.SINGLE, size: 2, color: this.borderColor }, left: { style: BorderStyle.SINGLE, size: 2, color: this.borderColor }, right: { style: BorderStyle.SINGLE, size: 2, color: this.borderColor } } }
	private tdLabel(text: string) { return new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [ this.cell(text, true) ], borders: this.borders(), shading: { type: ShadingType.CLEAR, fill: this.labelFill, color: 'auto' } }) }
	private tdValue(text?: string) { return new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, children: [ this.cell(text || '') ], borders: this.borders() }) }
	private row(label: string, value?: string) { return new TableRow({ height: { value: this.rowHeight, rule: 'atLeast' }, children: [ this.tdLabel(label), this.tdValue(value) ] }) }

	private createHeaderWithLogo(): Header {
		return new Header({
			children: [
				new Paragraph({
					alignment: AlignmentType.LEFT,
					spacing: { before: 200, after: 100 },
					children: [
						new TextRun({
							text: 'EXCLUSIVE HOUSEHOLD STAFF',
							font: 'Arial',
							size: 24,
							bold: true,
							color: '2F2F2F'
						})
					]
				})
			]
		});
	}



	async generateDocx(form: any): Promise<Buffer> {
		const rows: TableRow[] = []
		const L = (s: string) => s
		rows.push(this.row(L('Title (Dr, Mr, Mrs, Ms, Other) '), form?.title || ''))
		rows.push(this.row(L('First Name.'), form?.firstName || ''))
		rows.push(this.row(L('Last Name.'), form?.lastName || ''))
		rows.push(this.row(L('Preferred Gender Pronouns.'), form?.pronouns || ''))
		rows.push(this.row(L('Marital Status.'), form?.maritalStatus || ''))
		rows.push(this.row(L('Job Title.'), form?.jobTitle || ''))
		rows.push(this.row(L('Date of Birth.'), form?.dateOfBirth || ''))
		rows.push(this.row(L('Email address.'), form?.email || ''))
		rows.push(this.row(L('Mobile Telephone Number.'), form?.phone || ''))
		rows.push(this.row(L('Address.'), form?.address || ''))
		rows.push(this.row(L('Desired annual salary.'), form?.desiredSalary || ''))
		rows.push(this.row(L('Nationality.'), form?.nationality || ''))
		rows.push(this.row(L('Languages Spoken.'), form?.languages || ''))
		rows.push(this.row(L('UTR Number if Self-Employed.'), form?.utr || ''))
		rows.push(this.row(L('Do you have a current DBS?'), form?.currentDBS || ''))
		rows.push(this.row(L('Do you have a criminal record?'), form?.criminalRecord || ''))
		rows.push(this.row(L('Do you have a driving licence?'), form?.drivingLicence || ''))
		rows.push(this.row(L('Is your licence clean?'), form?.licenceClean || ''))
		rows.push(this.row(L('Happy to work in a residence with pets?'), form?.happyWithPets || ''))
		rows.push(this.row(L('Do you have any pets?'), form?.ownPets || ''))
		rows.push(this.row(L('Preferred work location.'), form?.preferredLocation || ''))
		rows.push(this.row(L('Willing to travel?'), form?.willingToTravel || ''))
		rows.push(this.row(L('Current notice period.'), form?.noticePeriod || ''))
		rows.push(this.row(L('Live in or out positions preferred?'), form?.liveInOrOut || ''))
		rows.push(this.row(L('Gender.'), form?.gender || ''))
		rows.push(this.row(L('Do you have legal proof of right to work in the UK?'), form?.rightToWork || ''))
		rows.push(this.row(L('Share code/pre/full settled status'), form?.shareCodeStatus || ''))
		rows.push(this.row(L('Do you have any dependants.'), form?.dependants || ''))
		rows.push(this.row(L('National Insurance Number.'), form?.niNumber || ''))
		rows.push(this.row(L('Do you smoke/vape?'), form?.smokeVape || ''))
		rows.push(this.row(L('Emergency Contact Details'), ''))
		rows.push(this.row(L('Name'), form?.emergencyName || ''))
		rows.push(this.row(L('Telephone'), form?.emergencyPhone || ''))
		rows.push(this.row(L('Relationship to Candidate'), form?.emergencyRelation || ''))

		const table = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows })
		const consent = new Paragraph({ spacing: { before: 200, after: 80 }, children: [ new TextRun({ text: `${form?.certified ? '☑' : '☐'}  I hereby certify that the above information is true and correct to the best of my knowledge`, font: this.font, size: 20 }) ] })
		const dated = new Paragraph({ children: [ new TextRun({ text: `Dated:  ${form?.dated || ''}`, font: this.font, size: 20 }) ] })

		const doc = new Document({
			sections: [{
				properties: { 
					page: { margin: { top: 2000, right: 1440, bottom: 1440, left: 1440 } }
				},
				headers: {
					default: this.createHeaderWithLogo()
				},
				children: [
					// Registration Form Title
					new Paragraph({
						spacing: { after: 200, line: 240 },
						alignment: AlignmentType.CENTER,
						children: [
							new TextRun({
								text: 'Candidate Registration Form',
								size: 30,
								color: '777777',
								font: 'Palatino Linotype',
								bold: true
							})
						]
					}),
					table,
					consent,
					dated
				]
			}],
			styles: { paragraphStyles: [ { id: 'Normal', name: 'Normal', basedOn: 'Normal', run: { font: this.font, size: 22 } } ] }
		})

		return await Packer.toBuffer(doc)
	}
}
