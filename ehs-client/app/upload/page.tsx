'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export default function UploadPage() {
	const [isUploading, setIsUploading] = useState(false)
	const [progress, setProgress] = useState(0)

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		if (!acceptedFiles.length) return
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
		if (!token) {
			toast.error('Please sign in first')
			window.location.href = '/login'
			return
		}
		const file = acceptedFiles[0]
		const formData = new FormData()
		formData.append('cv', file)

		try {
			setIsUploading(true)
			setProgress(10)
			const res = await axios.post(`${API_BASE}/cv/upload`, formData, {
				headers: { Authorization: `Bearer ${token}` },
				onUploadProgress: (e) => {
					if (!e.total) return
					setProgress(Math.round((e.loaded / e.total) * 100))
				},
			})
			if (res.data.success) {
				toast.success('Uploaded! Processing started')
				window.location.href = '/dashboard'
			} else {
				toast.error(res.data.error || 'Upload failed')
			}
		} catch (err: any) {
			const msg = err?.response?.data?.error || 'Upload failed'
			toast.error(msg)
			if (err?.response?.status === 401) {
				window.location.href = '/login'
			}
		} finally {
			setIsUploading(false)
			setProgress(0)
		}
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

	return (
		<div className="max-w-4xl mx-auto">
			{/* Header Section */}
			<div className="text-center mb-12">
				<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-2xl mb-6">
					<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
					</svg>
				</div>
				<h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Your CV</h1>
				<p className="text-xl text-gray-600 max-w-2xl mx-auto">
					Transform your raw CV into a professional, EHS-standard document. 
					Our AI will extract, structure, and format your content automatically.
				</p>
			</div>

			{/* Upload Area */}
			<div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
				<div 
					{...getRootProps()} 
					className={`
						border-3 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300
						${isDragActive 
							? 'border-red-400 bg-red-50 scale-105' 
							: 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
						}
					`}
				>
					<input {...getInputProps()} />
					
					<div className="mb-6">
						<div className={`w-24 h-24 mx-auto mb-4 transition-all duration-300 ${
							isDragActive ? 'scale-110' : ''
						}`}>
							<svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
						</div>
					</div>
					
					<h3 className="text-2xl font-semibold text-gray-900 mb-3">
						{isDragActive ? 'Drop your CV here!' : 'Drag & drop your CV here'}
					</h3>
					<p className="text-gray-600 mb-6">
						or <span className="text-red-600 font-semibold">click to browse</span>
					</p>
					
					<div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
						<span className="px-3 py-1 bg-gray-100 rounded-full">PDF</span>
						<span className="px-3 py-1 bg-gray-100 rounded-full">DOCX</span>
						<span className="px-3 py-1 bg-gray-100 rounded-full">XLS/XLSX</span>
						<span className="px-3 py-1 bg-gray-100 rounded-full">Max 10MB</span>
					</div>
				</div>

				{/* Progress Bar */}
				{isUploading && (
					<div className="mt-8">
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm font-medium text-gray-700">Processing your CV...</span>
							<span className="text-sm font-medium text-red-600">{progress}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
							<div 
								className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300 ease-out"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<p className="text-sm text-gray-500 mt-2 text-center">
							{progress < 50 ? 'Uploading file...' : progress < 100 ? 'Processing with AI...' : 'Finalizing...'}
						</p>
					</div>
				)}
			</div>

			{/* Info Cards */}
			<div className="grid md:grid-cols-3 gap-6 mt-12">
				<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
					<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
						<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<h4 className="font-semibold text-gray-900 mb-2">Fast Processing</h4>
					<p className="text-gray-600 text-sm">AI-powered extraction and formatting in seconds, not minutes.</p>
				</div>

				<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
					<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
						<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h4 className="font-semibold text-gray-900 mb-2">EHS Standards</h4>
					<p className="text-gray-600 text-sm">Automatic compliance with professional formatting requirements.</p>
				</div>

				<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
					<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
						<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
					<h4 className="font-semibold text-gray-900 mb-2">Preview & Edit</h4>
					<p className="text-gray-600 text-sm">Review and make final adjustments before export.</p>
				</div>
			</div>

			{/* Back to Home */}
			<div className="text-center mt-12">
				<Link 
					href="/" 
					className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
				>
					<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Back to Home
				</Link>
			</div>
		</div>
	)
}
