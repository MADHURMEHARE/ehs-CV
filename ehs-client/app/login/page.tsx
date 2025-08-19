"use client"

import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email })
      const token = res.data?.data?.token
      if (token) {
        localStorage.setItem('token', token)
        toast.success('Signed in')
        window.location.href = '/dashboard'
      } else {
        toast.error('No token received')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold">Sign in</h2>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Please wait…' : 'Sign in'}</button>
      </form>
      <p className="mt-4 text-sm text-gray-600 text-center">Don’t have an account? <a className="text-primary-700 ml-1" href="/signup">Create one</a></p>
    </div>
  )
}
