"use client"

import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import RegistrationFormModal from '@/components/RegistrationFormModal'

export default function SignUpPage() {
  const [isRegister] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [userId, setUserId] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: any = { email, password, firstName, lastName }
      const url = '/auth/register'
      const res = await api.post(url, payload)
      const token = res.data?.data?.token
      const userId = res.data?.data?.user?.id
      
      if (token && userId) {
        localStorage.setItem('token', token)
        setUserId(userId)
        toast.success('Registration successful! Please complete your profile.')
        setShowRegistrationModal(true)
      } else { 
        toast.error('No token received') 
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Request failed')
    } finally { setLoading(false) }
  }

  const handleRegistrationComplete = () => {
    setShowRegistrationModal(false)
    window.location.href = '/dashboard'
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold">Create an account</h2>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div className="grid grid-cols-2 gap-3">
          <input className="input-field" placeholder="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required />
          <input className="input-field" placeholder="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)} required />
        </div>
        <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Please wait…' : 'Register'}</button>
      </form>
      <p className="mt-4 text-sm text-gray-600 text-center">
        Already have an account? <a className="text-primary-700 ml-1" href="/login">Sign in</a>
      </p>
      
      {/* Registration Form Modal */}
      <RegistrationFormModal
        isOpen={showRegistrationModal}
        onClose={handleRegistrationComplete}
        userId={userId}
        userData={{
          firstName,
          lastName,
          email
        }}
      />
    </div>
  )
}
