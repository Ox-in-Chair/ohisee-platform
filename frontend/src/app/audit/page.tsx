import Link from 'next/link'
import { Search, ArrowLeft, ClipboardCheck } from 'lucide-react'

export default function AuditManagementPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Audit Schedule</h1>
          <p className="mt-2 opacity-90">OhiSee! Audit Management Module</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Schedule Audit</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audit Type *
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                required
              >
                <option value="">Select type</option>
                <option value="internal">Internal Audit</option>
                <option value="external">External Audit</option>
                <option value="supplier">Supplier Audit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audit Date *
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department/Area *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Area to be audited"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auditor
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Lead auditor name"
              />
            </div>

            <button type="submit" className="btn-primary">
              Schedule Audit
            </button>
          </form>
        </div>

        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">New Module</p>
              <p className="text-red-700 text-sm mt-1">
                Audit scheduling, finding tracking, and compliance reporting features coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}