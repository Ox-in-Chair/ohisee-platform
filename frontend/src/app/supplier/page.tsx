import Link from 'next/link'
import { Users, ArrowLeft, Building2 } from 'lucide-react'

export default function SupplierManagementPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Supplier Registration</h1>
          <p className="mt-2 opacity-90">OhiSee! Supplier Management Module</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Add New Supplier</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Primary contact name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="contact@supplier.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certification Type
              </label>
              <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none">
                <option value="">Select certification</option>
                <option value="gmp">GMP</option>
                <option value="iso">ISO 9001</option>
                <option value="haccp">HACCP</option>
                <option value="organic">Organic</option>
              </select>
            </div>

            <button type="submit" className="btn-primary">
              Add Supplier
            </button>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Setup Required</p>
              <p className="text-blue-700 text-sm mt-1">
                Supplier registration and certification tracking features are being configured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}