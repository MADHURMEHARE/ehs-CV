"use client"

import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setToken(res.data?.data?.resetToken || null)
      toast.success('Reset token generated')
    } catch (e: any) { toast.error(e?.response?.data?.error || 'Failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto card space-y-4">
      <h2 className="text-xl font-semibold">Forgot password</h2>
      <form className="space-y-3" onSubmit={submit}>
        <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Please wait…' : 'Generate reset link'}</button>
      </form>
      {token && (
        <div className="text-sm text-gray-700">
          <p className="font-medium">Demo token (use on reset page):</p>
          <textarea className="input-field w-full" rows={3} readOnly value={token} />
        </div>
      )}
    </div>
  )
}
