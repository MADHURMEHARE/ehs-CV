'use client'

import useSWR from 'swr'
import api from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useState } from 'react'
import CVPreview from '@/components/CVPreview'

const fetcher = (url: string) => api.get(url).then((r) => r.data)

export default function DashboardPage() {
	const { data, error, isLoading, mutate } = useSWR('/cv', fetcher)
	const [promo, setPromo] = useState('ehs-dev')

	const approve = async (id: string) => {
		try {
			await api.post(`/cv/${id}/approve`)
			toast.success('Approved')
			mutate()
		} catch (e: any) {
			toast.error(e?.response?.data?.error || 'Approve failed')
		}
	}

	const exportDoc = async (id: string, name?: string) => {
		try {
			const res = await api.get(`/export/${id}/docx`, { responseType: 'blob' })
			const url = window.URL.createObjectURL(new Blob([res.data]))
			const a = document.createElement('a')
			a.href = url
			a.download = (name || 'CV').replace(/\.[^/.]+$/, '') + '.docx'
			document.body.appendChild(a)
			a.click()
			a.remove()
			window.URL.revokeObjectURL(url)
		} catch (e: any) {
			toast.error(e?.response?.data?.error || 'Export failed')
		}
	}

	const exportRegistration = async (id: string) => {
		try {
			const res = await api.get(`/export/${id}/registration`, { responseType: 'blob' })
			const url = window.URL.createObjectURL(new Blob([res.data]))
			const a = document.createElement('a')
			a.href = url
			a.download = `RegistrationForm_${id}.docx`
			document.body.appendChild(a)
			a.click()
			a.remove()
			window.URL.revokeObjectURL(url)
		} catch (e: any) {
			toast.error(e?.response?.data?.error || 'Export failed')
		}
	}

	const promote = async () => {
		try {
			await api.post('/users/promote', { code: promo })
			toast.success('You are reviewer now')
		} catch (e: any) {
			toast.error(e?.response?.data?.error || 'Promotion failed')
		}
	}

	return (
		<div>
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Your CVs</h2>
				<div className="flex items-center gap-2">
					<input className="input-field w-48" value={promo} onChange={(e)=>setPromo(e.target.value)} />
					<button className="btn-secondary" onClick={promote}>Become Reviewer</button>
				</div>
			</div>
			{isLoading && <p className="mt-4 text-gray-600">Loading...</p>}
			{error && <p className="mt-4 text-red-600">Failed to load</p>}
			<div className="mt-6 space-y-6">
				{data?.data?.map((cv: any) => (
					<CVPreview key={cv._id} cv={cv} onUpdate={mutate} />
				))}
			</div>
		</div>
	)
}
