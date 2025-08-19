"use client"

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface RegistrationFormModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userData?: {
    firstName: string
    lastName: string
    email: string
  }
}

export default function RegistrationFormModal({ isOpen, onClose, userId, userData }: RegistrationFormModalProps) {
  const [form, setForm] = useState<any>({
    title: '',
    firstName: '',
    lastName: '',
    pronouns: '',
    maritalStatus: '',
    jobTitle: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    desiredSalary: '',
    nationality: '',
    languages: '',
    utr: '',
    currentDBS: '',
    criminalRecord: '',
    drivingLicence: '',
    licenceClean: '',
    happyWithPets: '',
    ownPets: '',
    preferredLocation: '',
    willingToTravel: '',
    noticePeriod: '',
    liveInOrOut: '',
    gender: '',
    rightToWork: '',
    shareCodeStatus: '',
    dependants: '',
    niNumber: '',
    smokeVape: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    certified: false,
    dated: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  // Pre-fill form with user data when modal opens
  useEffect(() => {
    if (isOpen && userData) {
      setForm((prev: any) => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || ''
      }))
    }
  }, [isOpen, userData])

  const handleInputChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/registration/submit', form)
      toast.success('Registration form submitted successfully!')
      onClose()
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to submit registration form')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Complete Your Registration</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Please complete your registration form to help us better understand your profile. 
            This information will be used to create your CV and can be updated later.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <select
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select Title</option>
                    <option value="Dr">Dr</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="input-field w-full"
                    rows={3}
                    placeholder="Enter your full address"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Professional Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desired Annual Salary</label>
                  <input
                    type="text"
                    value={form.desiredSalary}
                    onChange={(e) => handleInputChange('desiredSalary', e.target.value)}
                    className="input-field w-full"
                    placeholder="e.g., £25,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                  <input
                    type="text"
                    value={form.noticePeriod}
                    onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                    className="input-field w-full"
                    placeholder="e.g., 2 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Work Location</label>
                  <input
                    type="text"
                    value={form.preferredLocation}
                    onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    value={form.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={form.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    value={form.languages}
                    onChange={(e) => handleInputChange('languages', e.target.value)}
                    className="input-field w-full"
                    placeholder="e.g., English, Spanish"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National Insurance Number</label>
                  <input
                    type="text"
                    value={form.niNumber}
                    onChange={(e) => handleInputChange('niNumber', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UTR Number (if Self-Employed)</label>
                  <input
                    type="text"
                    value={form.utr}
                    onChange={(e) => handleInputChange('utr', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current DBS Status</label>
                  <select
                    value={form.currentDBS}
                    onChange={(e) => handleInputChange('currentDBS', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select DBS Status</option>
                    <option value="Yes, I have a current DBS">Yes, I have a current DBS</option>
                    <option value="No, I don't have a DBS">No, I don't have a DBS</option>
                    <option value="Applied, waiting for result">Applied, waiting for result</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driving Licence</label>
                  <select
                    value={form.drivingLicence}
                    onChange={(e) => handleInputChange('drivingLicence', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select Driving Licence Status</option>
                    <option value="Yes, I have a driving licence">Yes, I have a driving licence</option>
                    <option value="No, I don't have a driving licence">No, I don't have a driving licence</option>
                    <option value="Learning to drive">Learning to drive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Emergency Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={form.emergencyName}
                    onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={form.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={form.emergencyRelation}
                    onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                    className="input-field w-full"
                    placeholder="e.g., Spouse, Parent"
                  />
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="certified"
                  checked={form.certified}
                  onChange={(e) => handleInputChange('certified', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  required
                />
                <label htmlFor="certified" className="text-sm text-gray-700">
                  I hereby certify that the above information is true and correct to the best of my knowledge
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Skip for now
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
