"use client"

import useSWR from 'swr'
import api from '@/lib/api'
import Link from 'next/link'

const fetcher = (url: string) => api.get(url).then((r) => r.data)

export default function RegistrationLandingPage() {
  const { data, error, isLoading } = useSWR('/cv', fetcher)

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Registration Forms</h1>
      <p className="text-gray-600 mb-6">Choose a CV to fill its registration form.</p>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-600">Failed to load CVs</p>}
      <div className="space-y-3">
        {(data?.data || []).map((cv: any) => (
          <div key={cv._id} className="card flex items-center justify-between">
            <div>
              <p className="font-semibold">{cv.originalFileName}</p>
              <p className="text-sm text-gray-600">Status: {cv.status}</p>
            </div>
            <Link className="btn-primary" href={`/registration/${cv._id}`}>Open Form</Link>
          </div>
        ))}
        {data?.data?.length === 0 && (
          <p className="text-gray-600">You don’t have any CVs yet. Upload a CV first, then open its registration form.</p>
        )}
      </div>
    </div>
  )
}
