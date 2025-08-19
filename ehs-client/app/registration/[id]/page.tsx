"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface RegistrationFormData {
  title: string
  firstName: string
  lastName: string
  pronouns: string
  maritalStatus: string
  jobTitle: string
  dateOfBirth: string
  email: string
  phone: string
  address: string
  desiredSalary: string
  nationality: string
  languages: string
  utr: string
  currentDBS: string
  criminalRecord: string
  drivingLicence: string
  licenceClean: string
  happyWithPets: string
  ownPets: string
  preferredLocation: string
  willingToTravel: string
  noticePeriod: string
  liveInOrOut: string
  gender: string
  rightToWork: string
  shareCodeStatus: string
  dependants: string
  niNumber: string
  smokeVape: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
  certified: boolean
  dated: string
}

export default function RegistrationDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [registrationData, setRegistrationData] = useState<RegistrationFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/cv/${id}`)
        if (response.data?.data?.registrationForm) {
          setRegistrationData(response.data.data.registrationForm)
        } else {
          toast.error('Registration form not found')
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.error || 'Failed to fetch registration data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRegistrationData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!registrationData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-600">Registration form not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registration Form Details</h1>
        <Link href="/dashboard" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <p className="text-gray-900">{registrationData.title || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <p className="text-gray-900">{registrationData.firstName || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <p className="text-gray-900">{registrationData.lastName || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Pronouns</label>
                <p className="text-gray-900">{registrationData.pronouns || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Job Title</label>
                <p className="text-gray-900">{registrationData.jobTitle || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="text-gray-900">{registrationData.dateOfBirth || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{registrationData.email || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{registrationData.phone || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-900">{registrationData.address || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Additional Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Nationality</label>
                <p className="text-gray-900">{registrationData.nationality || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Languages</label>
                <p className="text-gray-900">{registrationData.languages || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Desired Salary</label>
                <p className="text-gray-900">{registrationData.desiredSalary || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Preferred Location</label>
                <p className="text-gray-900">{registrationData.preferredLocation || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notice Period</label>
                <p className="text-gray-900">{registrationData.noticePeriod || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Right to Work</label>
                <p className="text-gray-900">{registrationData.rightToWork || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Work & Legal Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Work & Legal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">UTR Number</label>
                <p className="text-gray-900">{registrationData.utr || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Current DBS</label>
                <p className="text-gray-900">{registrationData.currentDBS || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Criminal Record</label>
                <p className="text-gray-900">{registrationData.criminalRecord || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Driving Licence</label>
                <p className="text-gray-900">{registrationData.drivingLicence || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Licence Clean</label>
                <p className="text-gray-900">{registrationData.licenceClean || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Personal Preferences */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Personal Preferences</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Happy with Pets</label>
                <p className="text-gray-900">{registrationData.happyWithPets || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Own Pets</label>
                <p className="text-gray-900">{registrationData.ownPets || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Willing to Travel</label>
                <p className="text-gray-900">{registrationData.willingToTravel || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Live In/Out</label>
                <p className="text-gray-900">{registrationData.liveInOrOut || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Dependants</label>
                <p className="text-gray-900">{registrationData.dependants || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Smoke/Vape</label>
                <p className="text-gray-900">{registrationData.smokeVape || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Emergency Contact Name</label>
                <p className="text-gray-900">{registrationData.emergencyName || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                <p className="text-gray-900">{registrationData.emergencyPhone || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Relationship</label>
                <p className="text-gray-900">{registrationData.emergencyRelation || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Form Status */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Form Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Certified</label>
                <p className="text-gray-900">{registrationData.certified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date Submitted</label>
                <p className="text-gray-900">{registrationData.dated || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
