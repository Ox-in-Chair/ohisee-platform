'use client'

import { useState } from 'react'
import { X, Sparkles, Send } from 'lucide-react'
import toast from 'react-hot-toast'

interface AIAssistantProps {
  currentText: string
  onTextUpdate: (text: string) => void
  onClose: () => void
}

export function AIAssistant({ currentText, onTextUpdate, onClose }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([
    'Help me describe a safety concern clearly',
    'Make my report more professional',
    'Add more specific details',
    'Organize my thoughts better',
  ])

  const improveText = async (userPrompt?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          prompt: userPrompt || prompt,
        }),
      })

      if (!response.ok) throw new Error('Failed to improve text')

      const data = await response.json()
      onTextUpdate(data.improvedText)
      toast.success('Text improved successfully')
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
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">AI Writing Assistant</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              I can help you write a clear and professional report. Choose a suggestion or describe how you'd like to improve your text:
            </p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => improveText(suggestion)}
                  disabled={isLoading || !currentText}
                  className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Request
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to improve your text..."
                disabled={isLoading || !currentText}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={() => improveText()}
                disabled={isLoading || !prompt || !currentText}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!currentText && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Please write some text in the description field first before using the AI assistant.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}