"use client"

import { useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface RegistrationFormPreviewProps {
  registrationForm: any
  cvId: string
  onUpdate?: () => void
}

export default function RegistrationFormPreview({ registrationForm, cvId, onUpdate }: RegistrationFormPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExport = async () => {
    try {
      const res = await api.get(`/export/${cvId}/registration`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `RegistrationForm_${cvId}.docx`
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
    <div className="bg-white rounded-lg shadow border border-purple-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-purple-900">Registration Form</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Form Completed
              </span>
              <span className="text-sm text-purple-600">
                Submitted: {registrationForm.dated || 'Not specified'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-purple-600 hover:text-purple-900 px-3 py-1 rounded-md hover:bg-purple-100 transition-colors"
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
          <Link href={`/registration/${cvId}`} className="btn-primary">
            View Full Registration Form
          </Link>
          <button onClick={handleExport} className="btn-secondary">
            Export Registration Form
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-purple-600">Title:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.title || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Name:</span>
                    <span className="ml-2 text-purple-900">
                      {registrationForm.firstName} {registrationForm.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-600">Job Title:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.jobTitle || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Date of Birth:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.dateOfBirth || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Email:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.email || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Phone:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.phone || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Additional Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-purple-600">Nationality:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.nationality || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Languages:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.languages || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Desired Salary:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.desiredSalary || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Preferred Location:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.preferredLocation || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Notice Period:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.noticePeriod || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Right to Work:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.rightToWork || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Work & Legal Information */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Work & Legal Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-purple-600">UTR Number:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.utr || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Current DBS:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.currentDBS || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Criminal Record:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.criminalRecord || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Driving Licence:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.drivingLicence || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Licence Clean:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.licenceClean || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Personal Preferences */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Personal Preferences</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-purple-600">Happy with Pets:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.happyWithPets || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Own Pets:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.ownPets || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Willing to Travel:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.willingToTravel || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Live In/Out:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.liveInOrOut || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Dependants:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.dependants || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Smoke/Vape:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.smokeVape || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-purple-50 rounded-lg p-4 md:col-span-2">
                <h4 className="font-semibold text-purple-900 mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600">Name:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.emergencyName || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Phone:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.emergencyPhone || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Relationship:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.emergencyRelation || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Form Status */}
              <div className="bg-purple-50 rounded-lg p-4 md:col-span-2">
                <h4 className="font-semibold text-purple-900 mb-3">Form Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600">Certified:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.certified ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Date Submitted:</span>
                    <span className="ml-2 text-purple-900">{registrationForm.dated || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
