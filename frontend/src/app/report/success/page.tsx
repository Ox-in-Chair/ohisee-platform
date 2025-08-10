'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Copy, Home, FileText } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ReportSuccessPage() {
  const searchParams = useSearchParams()
  const referenceNumber = searchParams.get('ref') || 'REF-2025-00001'
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceNumber)
    setCopied(true)
    toast.success('Reference number copied!')
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-card p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Report Submitted Successfully
          </h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for submitting your confidential report. Your concerns have been received 
            and will be investigated according to our BRCGS compliance procedures.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Your Reference Number</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold text-primary">
                {referenceNumber}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy reference number"
              >
                <Copy className={`w-5 h-5 ${copied ? 'text-green-500' : 'text-gray-500'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Save this reference number to track your report status
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">What Happens Next?</h3>
            <ul className="text-sm text-blue-800 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Your report will be reviewed by the Admin Manager within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>An investigation will be initiated if warranted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>You will receive a response within one week</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Your identity will remain confidential throughout the process</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
            <Link
              href="/report/track"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Track Report
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}