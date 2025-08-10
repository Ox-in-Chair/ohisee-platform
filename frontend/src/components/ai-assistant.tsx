'use client'

import { useState } from 'react'
import { X, Sparkles, CheckCircle, FileText, Wand2, Type } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'

interface AIAssistantProps {
  currentText: string
  onTextUpdate: (text: string) => void
  onClose: () => void
}

export function AIAssistant({ currentText, onTextUpdate, onClose }: AIAssistantProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastAction, setLastAction] = useState<string>('')

  const improveText = async (taskType: string, taskName: string) => {
    if (!currentText || currentText.trim().length < 10) {
      toast.error('Please enter at least 10 characters of text to improve');
      return;
    }
    
    setIsLoading(true)
    setLastAction(taskName)
    
    try {
      const data = await api.improveText(taskType, currentText);
      onTextUpdate(data.improvedText)
      toast.success(`${taskName} completed successfully`)
    } catch (error) {
      toast.error('Failed to improve text. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">AI Report Assistant</h3>
                <p className="text-sm text-gray-600">Choose how to improve your report text</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Current Text Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Text:
            </label>
            <div className="p-4 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap">{currentText || 'No text entered yet'}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentText.length} characters
            </p>
          </div>

          {/* Action Buttons - RESTRICTED OPTIONS ONLY */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Select an improvement option:
            </h4>
            
            <button
              onClick={() => improveText('improve_clarity', 'Improve Clarity')}
              disabled={isLoading || !currentText}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Improve Clarity</p>
                <p className="text-sm text-gray-600">Make the text clearer and easier to understand</p>
              </div>
            </button>

            <button
              onClick={() => improveText('make_professional', 'Make Professional')}
              disabled={isLoading || !currentText}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Make Professional</p>
                <p className="text-sm text-gray-600">Rewrite in a more formal and professional tone</p>
              </div>
            </button>

            <button
              onClick={() => improveText('fix_grammar', 'Fix Grammar')}
              disabled={isLoading || !currentText}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Type className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Fix Grammar</p>
                <p className="text-sm text-gray-600">Correct grammar, spelling, and punctuation errors</p>
              </div>
            </button>

            <button
              onClick={() => improveText('create_summary', 'Create Summary')}
              disabled={isLoading || !currentText}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Create Summary</p>
                <p className="text-sm text-gray-600">Generate a brief 2-3 sentence summary</p>
              </div>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <p className="text-sm text-blue-700">Processing: {lastAction}...</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> This AI assistant is restricted to improving confidential reports only. 
              It cannot answer general questions or perform unrelated tasks.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  )
}