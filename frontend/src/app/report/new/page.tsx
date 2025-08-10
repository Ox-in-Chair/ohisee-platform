'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DocumentHeader } from '@/components/document-header'
import { AIAssistant } from '@/components/ai-assistant'
import { FileUpload } from '@/components/file-upload'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const reportSchema = z.object({
  category: z.enum(['product_safety', 'misconduct', 'health_safety', 'harassment']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().optional(),
  date_occurred: z.string().optional(),
  time_occurred: z.string().optional(),
  witnesses: z.string().optional(),
  previous_report: z.boolean(),
  email: z.string().email().optional().or(z.literal('')),
})

type ReportFormData = z.infer<typeof reportSchema>

export default function NewReportPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  })

  const description = watch('description')

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, String(value))
        }
      })
      
      attachments.forEach((file) => {
        formData.append('attachments', file)
      })

      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to submit report')

      const result = await response.json()
      toast.success(`Report submitted successfully. Reference: ${result.reference_number}`)
      router.push(`/report/success?ref=${result.reference_number}`)
    } catch (error) {
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <DocumentHeader className="mb-8" />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-container">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Submit Confidential Report</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="product_safety">Product Safety & Quality</option>
                  <option value="misconduct">Misconduct & Ethics</option>
                  <option value="health_safety">Health & Safety</option>
                  <option value="harassment">Harassment & Discrimination</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title *
                </label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="Brief summary of your concern"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    {...register('description')}
                    rows={6}
                    placeholder="Provide detailed information about your concern..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAIAssistant(true)}
                    className="absolute bottom-2 right-2 text-sm text-primary hover:text-primary/80"
                  >
                    AI Writing Assistant
                  </button>
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  {...register('location')}
                  placeholder="Where did this occur?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Occurred (Optional)
                  </label>
                  <input
                    type="date"
                    {...register('date_occurred')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Occurred (Optional)
                  </label>
                  <input
                    type="time"
                    {...register('time_occurred')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Witnesses (Optional)
                </label>
                <input
                  type="text"
                  {...register('witnesses')}
                  placeholder="Names of anyone who witnessed the incident"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('previous_report')}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">
                    I have previously reported this issue
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional - for updates)
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Providing email is optional. If provided, it will be kept strictly confidential.
                </p>
              </div>

              <FileUpload
                onFilesChange={setAttachments}
                maxFiles={5}
                maxSize={10 * 1024 * 1024}
              />
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        {showAIAssistant && (
          <AIAssistant
            currentText={description || ''}
            onTextUpdate={(text) => {
              setValue('description', text)
              setShowAIAssistant(false)
            }}
            onClose={() => setShowAIAssistant(false)}
          />
        )}
      </div>
    </main>
  )
}