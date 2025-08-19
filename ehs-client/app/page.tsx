import Link from 'next/link'

export default function HomePage() {
	return (
		<div className="space-y-16">
			{/* Hero Section */}
			<section className="text-center py-20">
				<div className="max-w-4xl mx-auto">
					<div className="mb-8">
						{/* EHS Logo and Branding */}
						<div className="flex justify-center items-center mb-8">
							<img src="/ehs-logo.svg" alt="EHS" className="h-20 w-auto mr-4" />
							<div className="text-left">
								<div className="text-4xl font-bold text-red-600">EHS</div>
								<div className="text-lg text-gray-600 font-medium">Exclusive Household Staff</div>
							</div>
						</div>
						
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-2xl mb-6">
							<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-700 to-gray-900 bg-clip-text text-transparent mb-6">
							AI-Powered CV Formatter
						</h1>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Transform raw CVs into polished, professional documents with intelligent AI processing. 
							Upload PDF, DOCX, or Excel files and get EHS-standard formatted CVs instantly.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Link 
							href="/upload" 
							className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
						>
							Start Formatting CV
						</Link>
						<Link 
							href="/dashboard" 
							className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-red-300 hover:text-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
						>
							View Dashboard
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose EHS CV Formatter?</h2>
				<div className="grid md:grid-cols-3 gap-8">
					<div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-red-200">
						<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
							</svg>
						</div>
						<h3 className="font-bold text-xl text-gray-900 mb-4">Multi-Format Support</h3>
						<p className="text-gray-600 leading-relaxed">
							Handle PDF, DOCX, and Excel files with robust text extraction and intelligent error handling. 
							No more manual copying and pasting.
						</p>
					</div>

					<div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-red-200">
						<div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h3 className="font-bold text-xl text-gray-900 mb-4">EHS Standards Compliance</h3>
						<p className="text-gray-600 leading-relaxed">
							Automatic formatting with Palatino Linotype, short month dates, professional bullet points, 
							and clean, industry-standard language.
						</p>
					</div>

					<div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-red-200">
						<div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
						</div>
						<h3 className="font-bold text-xl text-gray-900 mb-4">Professional Editor</h3>
						<p className="text-gray-600 leading-relaxed">
							Word-like full-page editor with side-by-side preview, inline editing, and instant DOCX export. 
							Perfect for final touches and professional presentation.
						</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="text-center py-16">
				<div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-12 text-white shadow-2xl">
					<h2 className="text-3xl font-bold mb-6">Ready to Transform Your CV?</h2>
					<p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
						Join thousands of professionals who trust EHS for their CV formatting needs. 
						Get started in minutes, not hours.
					</p>
					<Link 
						href="/upload" 
						className="inline-block bg-white text-red-600 px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
					>
						Upload Your CV Now
					</Link>
				</div>
			</section>
		</div>
	);
}
