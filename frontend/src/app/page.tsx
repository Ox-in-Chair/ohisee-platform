import Link from 'next/link'
import { DocumentHeader } from '@/components/document-header'
import { Shield, FileText, Users, Bell } from 'lucide-react'

// OhiSee! Homepage - Cloud Deployment Version
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <DocumentHeader className="mb-8" />
        
        {/* Dashboard Link */}
        <div className="bg-primary text-white rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Access Full Platform</h2>
              <p className="opacity-90 text-sm mt-1">View all 7 compliance modules in the dashboard</p>
            </div>
            <Link href="/dashboard" className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Open Dashboard
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="form-container">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-semibold text-gray-800">Submit a Report</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Report concerns anonymously and securely. Your identity will be protected throughout the process.
            </p>
            <Link href="/report/new" className="btn-primary inline-block">
              Submit Confidential Report
            </Link>
          </div>

          <div className="form-container">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-secondary" />
              <h2 className="text-2xl font-semibold text-gray-800">Track Your Report</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Check the status of your submitted report using your unique reference number.
            </p>
            <Link href="/report/track" className="btn-secondary inline-block">
              Track Confidential Report
            </Link>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <CategoryCard
            icon={<Shield className="w-6 h-6" />}
            title="Product Safety"
            description="Report food safety and quality concerns"
            color="bg-blue-500"
          />
          <CategoryCard
            icon={<Users className="w-6 h-6" />}
            title="Misconduct"
            description="Report ethical violations or misconduct"
            color="bg-purple-500"
          />
          <CategoryCard
            icon={<Bell className="w-6 h-6" />}
            title="Health & Safety"
            description="Report workplace safety issues"
            color="bg-green-500"
          />
          <CategoryCard
            icon={<Users className="w-6 h-6" />}
            title="Harassment"
            description="Report discrimination or harassment"
            color="bg-red-500"
          />
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-card p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Rights & Protections</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Complete anonymity - your identity is never required</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Protection from retaliation under GMP compliance standards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Confidential investigation process with timely responses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>AI-powered writing assistance to help you articulate concerns</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}

function CategoryCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
      <div className={`${color} text-white p-3 rounded-lg inline-block mb-3`}>
        {icon}
      </div>
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}