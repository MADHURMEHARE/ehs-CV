"use client"

import { useState } from 'react'
import api from '@/lib/api'

export default function PhotoUpload({ cvId, current, onUploaded }: { cvId: string, current?: string, onUploaded?: (url: string)=>void }) {
	const [preview, setPreview] = useState<string | undefined>(current)
	const [loading, setLoading] = useState(false)

	const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setPreview(URL.createObjectURL(file))
		const form = new FormData()
		form.append('photo', file)
		setLoading(true)
		try {
			const res = await api.post(`/cv/${cvId}/photo`, form)
			const url = res.data?.data?.url
			if (url && onUploaded) onUploaded(url)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-4">
				<input type="file" accept="image/*" onChange={onChange} />
				{loading && <span className="text-sm text-gray-500">Uploading...</span>}
			</div>
			{preview && <img src={preview} alt="preview" className="h-32 w-32 object-cover rounded" />}
		</div>
	)
}
