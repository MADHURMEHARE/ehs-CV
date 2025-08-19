"use client"

import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, newPassword })
      toast.success('Password updated. You can sign in now.')
      window.location.href = '/login'
    } catch (e: any) { toast.error(e?.response?.data?.error || 'Reset failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto card space-y-4">
      <h2 className="text-xl font-semibold">Reset password</h2>
      <form className="space-y-3" onSubmit={submit}>
        <textarea className="input-field" placeholder="Paste reset token" value={token} onChange={(e)=>setToken(e.target.value)} rows={3} required />
        <input className="input-field" type="password" placeholder="New password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required />
        <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Please wait…' : 'Reset password'}</button>
      </form>
    </div>
  )
}
