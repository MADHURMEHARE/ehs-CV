"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface CVData {
  _id: string
  originalFileName?: string
  processedData?: {
    personalInfo: {
      firstName: string
      lastName: string
      jobTitle: string
      photoUrl: string
      nationality: string
      dateOfBirth: string
      maritalStatus: string
      email: string
      phone: string
      address: string
    }
    profile: string
    experience: Array<{
      company: string
      position: string
      startDate: string
      endDate: string
      current: boolean
      description: string[]
      achievements: string[]
    }>
    education: Array<{
      institution: string
      degree: string
      field: string
      startDate: string
      endDate: string
      gpa: string
    }>
    skills: string[]
    interests: string[]
    languages: Array<{
      name: string
      proficiency: string
    }>
    certifications: string[]
  }
  status: string
  registrationForm?: any
}

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedData, setEditedData] = useState<any>(null)

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/cv/${id}`)
        if (response.data?.data) {
          setCvData(response.data.data)
          setEditedData(response.data.data.processedData || {})
        } else {
          toast.error('CV not found')
          router.push('/dashboard')
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.error || 'Failed to fetch CV data')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCVData()
    }
  }, [id, router])

  const handleSave = async () => {
    try {
      await api.put(`/cv/${id}`, editedData)
      toast.success('CV updated successfully!')
      setEditing(false)
      // Refresh data
      const response = await api.get(`/cv/${id}`)
      if (response.data?.data) {
        setCvData(response.data.data)
        setEditedData(response.data.data.processedData || {})
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to update CV')
    }
  }

  const handleExport = async () => {
    try {
      const res = await api.get(`/export/${id}/docx`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = (cvData?.originalFileName || 'CV').replace(/\.[^/.]+$/, '') + '.docx'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('CV exported successfully!')
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Export failed')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!cvData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-600">CV not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CV Editor & Preview</h1>
          <p className="text-gray-600 mt-2">
            {cvData.originalFileName || 'CV'} - Status: {cvData.status}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
          {editing ? (
            <>
              <button onClick={handleSave} className="btn-primary">
                Save Changes
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="btn-primary">
                Edit CV
              </button>
              <button onClick={handleExport} className="btn-secondary">
                Export CV
              </button>
            </>
          )}
        </div>
      </div>

      {cvData.processedData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={editedData.personalInfo?.firstName || ''}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, firstName: e.target.value }
                    })}
                    className="input-field w-full"
                  />
                ) : (
                  <p className="text-gray-900">{cvData.processedData.personalInfo.firstName || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={editedData.personalInfo?.lastName || ''}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, lastName: e.target.value }
                    })}
                    className="input-field w-full"
                  />
                ) : (
                  <p className="text-gray-900">{cvData.processedData.personalInfo.lastName || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Job Title</label>
                {editing ? (
                  <input
                    type="text"
                    value={editedData.personalInfo?.jobTitle || ''}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, jobTitle: e.target.value }
                    })}
                    className="input-field w-full"
                  />
                ) : (
                  <p className="text-gray-900">{cvData.processedData.personalInfo.jobTitle || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={editedData.personalInfo?.email || ''}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, email: e.target.value }
                    })}
                    className="input-field w-full"
                  />
                ) : (
                  <p className="text-gray-900">{cvData.processedData.personalInfo.email || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                {editing ? (
                  <input
                    type="text"
                    value={editedData.personalInfo?.phone || ''}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, phone: e.target.value }
                    })}
                    className="input-field w-full"
                  />
                ) : (
                  <p className="text-gray-900">{cvData.processedData.personalInfo.phone || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Photo Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Profile Photo</h2>
            <div className="space-y-4">
              {editing ? (
                <div>
                  <label className="text-sm font-medium text-gray-700">Photo URL</label>
                  <input
                    type="url"
                    value={editedData.personalInfo?.photoUrl || ''}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, photoUrl: e.target.value }
                    })}
                    className="input-field w-full"
                    placeholder="Enter photo URL (e.g., https://example.com/photo.jpg)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a valid image URL. The photo will appear in the middle of your CV when exported.
                  </p>
                </div>
              ) : (
                <div>
                  {cvData.processedData.personalInfo.photoUrl ? (
                    <div className="text-center">
                      <img
                        src={cvData.processedData.personalInfo.photoUrl}
                        alt="Profile Photo"
                        className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      <p className="hidden text-sm text-gray-500 mt-2">Photo URL: {cvData.processedData.personalInfo.photoUrl}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500">No photo uploaded</p>
                      <p className="text-sm text-gray-400">Photo will appear in the middle of your CV when exported</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Profile Summary</h2>
            {editing ? (
              <textarea
                value={editedData.profile || ''}
                onChange={(e) => setEditedData({ ...editedData, profile: e.target.value })}
                className="input-field w-full h-32"
                placeholder="Enter your professional profile summary..."
              />
            ) : (
              <p className="text-gray-900">{cvData.processedData.profile || 'No profile summary available'}</p>
            )}
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Work Experience</h2>
            {cvData.processedData.experience && cvData.processedData.experience.length > 0 ? (
              <div className="space-y-4">
                {cvData.processedData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <h3 className="font-semibold text-lg">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && exp.description.length > 0 && (
                      <ul className="list-disc list-inside mt-2 text-gray-700">
                        {exp.description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No work experience available</p>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Education</h2>
            {cvData.processedData.education && cvData.processedData.education.length > 0 ? (
              <div className="space-y-3">
                {cvData.processedData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-200 pl-4">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No education information available</p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Skills</h2>
            {cvData.processedData.skills && cvData.processedData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cvData.processedData.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills listed</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">This CV hasn't been processed yet.</p>
          <p className="text-sm text-gray-500">Processing may take a few minutes. Please check back later.</p>
        </div>
      )}

      {/* Registration Form Section */}
      {cvData.registrationForm && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-600">Registration Form</h2>
            <div className="flex gap-3">
              <Link href={`/registration/${id}`} className="btn-secondary">
                View Registration Form
              </Link>
              <button 
                onClick={async () => {
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
                    toast.success('Registration form exported successfully!')
                  } catch (error: any) {
                    toast.error(error?.response?.data?.error || 'Export failed')
                  }
                }} 
                className="btn-primary"
              >
                Export Registration Form
              </button>
            </div>
          </div>
          <p className="text-gray-600">Registration form is available for this CV.</p>
        </div>
      )}
    </div>
  )
}
