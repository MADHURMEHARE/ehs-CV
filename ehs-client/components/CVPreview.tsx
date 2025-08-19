"use client"

import { useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface CVPreviewProps {
  cv: any
  onUpdate?: () => void
}

export default function CVPreview({ cv, onUpdate }: CVPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExport = async () => {
    try {
      const res = await api.get(`/export/${cv._id}/docx`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = (cv.originalFileName || 'CV').replace(/\.[^/.]+$/, '') + '.docx'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('CV exported successfully!')
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Export failed')
    }
  }

  const handleExportRegistration = async () => {
    try {
      const res = await api.get(`/export/${cv._id}/registration`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `RegistrationForm_${cv._id}.docx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Registration form exported successfully!')
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Export failed')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {cv.originalFileName || (cv.registrationForm ? 'Registration Form' : 'CV')}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                cv.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                cv.status === 'PROCESSED' ? 'bg-blue-100 text-blue-800' :
                cv.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {cv.status}
              </span>
              {cv.registrationForm && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Registration Form Available
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          {cv.originalFileName && (
            <>
              <Link href={`/editor/${cv._id}`} className="btn-primary">
                Open CV Editor
              </Link>
              <button onClick={handleExport} className="btn-secondary">
                Export CV
              </button>
            </>
          )}
          {cv.registrationForm && (
            <>
              <Link href={`/registration/${cv._id}`} className="btn-secondary">
                View Registration Form
              </Link>
              <button onClick={handleExportRegistration} className="btn-secondary">
                Export Registration Form
              </button>
            </>
          )}
          <button 
            onClick={async () => {
              try {
                await api.post(`/cv/${cv._id}/approve`)
                toast.success('CV approved successfully!')
                onUpdate?.()
              } catch (error: any) {
                toast.error(error?.response?.data?.error || 'Approval failed')
              }
            }} 
            className="btn-primary"
          >
            Approve CV
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6">
            {/* CV Data Preview */}
            {cv.processedData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 text-gray-900">
                        {cv.processedData.personalInfo?.firstName} {cv.processedData.personalInfo?.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Job Title:</span>
                      <span className="ml-2 text-gray-900">{cv.processedData.personalInfo?.jobTitle || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{cv.processedData.personalInfo?.email || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{cv.processedData.personalInfo?.phone || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Profile Summary</h4>
                  <p className="text-sm text-gray-700">
                    {cv.processedData.profile ? 
                      cv.processedData.profile.substring(0, 150) + (cv.processedData.profile.length > 150 ? '...' : '') :
                      'No profile summary available'
                    }
                  </p>
                </div>

                {/* Experience */}
                {cv.processedData.experience && cv.processedData.experience.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Work Experience</h4>
                    <div className="space-y-3">
                      {cv.processedData.experience.slice(0, 2).map((exp: any, index: number) => (
                        <div key={index} className="border-l-2 border-blue-300 pl-3">
                          <div className="font-medium text-gray-900">{exp.position}</div>
                          <div className="text-sm text-gray-600">{exp.company}</div>
                          <div className="text-xs text-gray-500">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </div>
                        </div>
                      ))}
                      {cv.processedData.experience.length > 2 && (
                        <div className="text-sm text-gray-500 italic">
                          +{cv.processedData.experience.length - 2} more positions
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {cv.processedData.skills && cv.processedData.skills.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {cv.processedData.skills.slice(0, 6).map((skill: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {cv.processedData.skills.length > 6 && (
                        <span className="text-xs text-gray-500 self-center">
                          +{cv.processedData.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Education */}
                {cv.processedData.education && cv.processedData.education.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Education</h4>
                    <div className="space-y-2">
                      {cv.processedData.education.slice(0, 2).map((edu: any, index: number) => (
                        <div key={index}>
                          <div className="font-medium text-gray-900">{edu.degree}</div>
                          <div className="text-sm text-gray-600">{edu.institution}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Registration Form Preview */}
            {cv.registrationForm && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3">Registration Form Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600">Name:</span>
                    <span className="ml-2 text-purple-900">
                      {cv.registrationForm.firstName} {cv.registrationForm.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-600">Job Title:</span>
                    <span className="ml-2 text-purple-900">{cv.registrationForm.jobTitle || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Email:</span>
                    <span className="ml-2 text-purple-900">{cv.registrationForm.email || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Phone:</span>
                    <span className="ml-2 text-purple-900">{cv.registrationForm.phone || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Status */}
            {!cv.processedData && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
                  <span className="text-yellow-800">CV is being processed. This may take a few minutes.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
