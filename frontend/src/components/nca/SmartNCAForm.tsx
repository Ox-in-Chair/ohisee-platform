'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, HelpCircle, Camera, MapPin, Barcode, 
  CheckCircle, XCircle, Clock, FileText, Search, Bot,
  Lightbulb, Shield, Zap, Upload, Eye, Save
} from 'lucide-react'

interface SmartTooltipProps {
  content: string
  aiAssist?: boolean
  children: React.ReactNode
}

function SmartTooltip({ content, aiAssist = false, children }: SmartTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-slate-900 text-white text-sm rounded-lg p-3 shadow-xl z-50 animate-fade-in">
          <div className="flex items-start gap-2">
            {aiAssist && <Bot className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
            <div>
              <p>{content}</p>
              {aiAssist && (
                <button className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Ask AI Assistant
                </button>
              )}
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-4 w-2 h-2 bg-slate-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  )
}

interface AIAssistantProps {
  fieldName: string
  currentValue: string
  onSuggestion: (suggestion: string) => void
}

function AIAssistant({ fieldName, currentValue, onSuggestion }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getSuggestions = async () => {
    setIsLoading(true)
    // Simulate AI suggestions based on field type
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockSuggestions = {
      description: [
        "Foreign material contamination detected in finished pouches during final inspection",
        "Seal integrity failure - temperature deviation outside specification limits", 
        "Print quality issue - ink smudging on product labels"
      ],
      rootCause: [
        "Equipment malfunction - cutting blade wear causing metal particles",
        "Process control deviation - temperature controller calibration drift",
        "Human error - operator not following standard procedure"
      ],
      correctiveAction: [
        "Implement enhanced blade inspection protocol and replacement schedule",
        "Recalibrate temperature controllers and update maintenance schedule",
        "Provide additional operator training and update work instructions"
      ]
    }

    setSuggestions(mockSuggestions[fieldName as keyof typeof mockSuggestions] || [])
    setIsLoading(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) getSuggestions()
        }}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg transition-colors"
      >
        <Bot className="w-4 h-4" />
        AI Assist
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">AI Assistant</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Analyzing similar cases...
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Based on similar NCAs, here are some suggestions:</p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSuggestion(suggestion)
                      setIsOpen(false)
                    }}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm border border-transparent hover:border-blue-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SmartNCAForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    // Section A: Incident Details
    date: new Date().toISOString().split('T')[0],
    supplierName: '',
    productType: 'finished_product',
    ncaNumber: '', // Auto-generated
    productDescription: '',
    
    // Section B: Non-Conformance Details
    ncDescription: '',
    quantity: '',
    quantityUnit: 'units',
    sampleAvailable: false,
    supplierBatchNo: '',
    supplierReelBoxNumbers: '',
    kangopakWONumber: '',
    kangopakCartonNumbers: '',
    ncaRaisedBy: '',
    
    // Section C: Immediate Action Checklist
    crossContamination: false,
    crossContaminationAction: '',
    backTrackingCompleted: false,
    backTrackingPerson: '',
    holdLabelCompleted: false,
    ncaRecordedOnLogSheet: false,
    segregationCompleted: false,
    
    // Section D: Disposition
    disposition: 'pending',
    rejectToSupplier: false,
    creditRequired: false,
    upliftmentRequired: false,
    reworkRequired: false,
    concessionGranted: false,
    discardAtKangopak: false,
    reworkInstructions: '',
    authorizedBy: '',
    
    // Section E: Investigation
    rootCauseAnalysis: '',
    correctiveActionTaken: '',
    
    // Metadata
    priority: 'medium',
    assignedTo: '',
    impact: 'quality'
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Auto-generate NCA number
  useEffect(() => {
    const year = new Date().getFullYear()
    const sequence = String(Date.now()).slice(-4) // Use timestamp for unique sequence
    setFormData(prev => ({
      ...prev,
      ncaNumber: `NCA-${year}-${sequence}`
    }))
  }, [])

  const steps = [
    { id: 1, name: 'Incident Details', icon: FileText },
    { id: 2, name: 'Non-Conformance', icon: AlertTriangle },
    { id: 3, name: 'Immediate Actions', icon: Zap },
    { id: 4, name: 'Disposition', icon: CheckCircle },
    { id: 5, name: 'Investigation', icon: Search }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStep = (step: number): string[] => {
    const errors: string[] = []
    
    switch (step) {
      case 1:
        if (!formData.supplierName) errors.push('Supplier name is required')
        if (!formData.productDescription) errors.push('Product description is required')
        break
      case 2:
        if (!formData.ncDescription) errors.push('Non-conformance description is required')
        if (!formData.quantity) errors.push('Quantity is required')
        break
      case 3:
        if (formData.crossContamination && !formData.crossContaminationAction) {
          errors.push('Cross contamination action is required')
        }
        break
    }
    
    return errors
  }

  const nextStep = () => {
    const errors = validateStep(currentStep)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }
    setValidationErrors([])
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">New Non-Conformance Advice</h2>
                <p className="text-white/80 text-sm">BRCGS 5.7 Control of Non-Conforming Product</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                {formData.ncaNumber}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-orange-100 text-orange-700' :
                    isCompleted ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h4 className="font-medium text-red-800">Please fix the following errors:</h4>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 1: Incident Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SmartTooltip content="Record the exact date when non-conformance was first detected. This starts the 20-day close-out countdown.">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Detected <span className="text-red-500">*</span>
                      <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                    </label>
                  </SmartTooltip>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <SmartTooltip content="Select supplier from dropdown. For internal issues, select 'Kangopak'. This affects notification routing." aiAssist>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier Name <span className="text-red-500">*</span>
                      <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                    </label>
                  </SmartTooltip>
                  <div className="flex gap-2">
                    <select
                      value={formData.supplierName}
                      onChange={(e) => handleInputChange('supplierName', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Supplier</option>
                      <option value="Kangopak">Kangopak (Internal)</option>
                      <option value="XYZ Films">XYZ Films</option>
                      <option value="ABC Packaging">ABC Packaging</option>
                      <option value="DEF Materials">DEF Materials</option>
                    </select>
                    <AIAssistant
                      fieldName="supplier"
                      currentValue={formData.supplierName}
                      onSuggestion={(suggestion) => handleInputChange('supplierName', suggestion)}
                    />
                  </div>
                </div>

                <div>
                  <SmartTooltip content="Raw Material = incoming supplies, WIP = during production, Finished Goods = completed products. This determines required actions.">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type <span className="text-red-500">*</span>
                      <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                    </label>
                  </SmartTooltip>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'raw_material', label: 'Raw Material', icon: '📦' },
                      { value: 'wip', label: 'Work in Progress', icon: '⚙️' },
                      { value: 'finished_product', label: 'Finished Product', icon: '✅' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('productType', type.value)}
                        className={`p-3 border-2 rounded-lg text-center transition-colors ${
                          formData.productType === type.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg mb-1">{type.icon}</div>
                        <div className="text-xs font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <SmartTooltip content="Auto-generated unique identifier. Format: NCA-YYYY-#### (e.g., NCA-2025-0001)">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NCA Number
                      <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                    </label>
                  </SmartTooltip>
                  <input
                    type="text"
                    value={formData.ncaNumber}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                  />
                </div>
              </div>

              <div>
                <SmartTooltip content="Be specific: include product name, size, specification. Example: 'Stand-up pouches 250ml, clear with black print'" aiAssist>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description <span className="text-red-500">*</span>
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                </SmartTooltip>
                <div className="flex gap-2">
                  <textarea
                    value={formData.productDescription}
                    onChange={(e) => handleInputChange('productDescription', e.target.value)}
                    rows={3}
                    placeholder="Describe the product affected by this non-conformance..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="flex flex-col gap-2">
                    <AIAssistant
                      fieldName="description"
                      currentValue={formData.productDescription}
                      onSuggestion={(suggestion) => handleInputChange('productDescription', suggestion)}
                    />
                    <SmartTooltip content="Take a photo of the affected product">
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        Photo
                      </button>
                    </SmartTooltip>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Non-Conformance Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                  <h3 className="font-medium text-blue-800">Non-Conformance Details</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Provide detailed information about the non-conforming product. Be specific and factual.
                </p>
              </div>

              <div>
                <SmartTooltip content="Describe EXACTLY what is wrong. Be factual, specific, and measurable. Include: what was found, where it was found, when it was detected, and any measurements. Example: 'Foreign material (metal fragments 2-3mm) found in 3 pouches during final inspection at position #4 on Line 2.'" aiAssist>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Non-Conformance Description <span className="text-red-500">*</span>
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                </SmartTooltip>
                <div className="flex gap-2">
                  <textarea
                    value={formData.ncDescription}
                    onChange={(e) => handleInputChange('ncDescription', e.target.value)}
                    rows={4}
                    placeholder="Describe the non-conformance in detail - what, where, when, and how much..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="flex flex-col gap-2">
                    <AIAssistant
                      fieldName="description"
                      currentValue={formData.ncDescription}
                      onSuggestion={(suggestion) => handleInputChange('ncDescription', suggestion)}
                    />
                    <SmartTooltip content="Take photos of the non-conforming product">
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        Photos
                      </button>
                    </SmartTooltip>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <SmartTooltip content="Enter the total quantity affected. Be precise - this determines impact assessment and cost calculations.">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity Affected <span className="text-red-500">*</span>
                      <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                    </label>
                  </SmartTooltip>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <SmartTooltip content="Select the unit of measurement. This must match your inventory system for accurate tracking.">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit of Measure
                      <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                    </label>
                  </SmartTooltip>
                  <select
                    value={formData.quantityUnit}
                    onChange={(e) => handleInputChange('quantityUnit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="units">Units/Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="grams">Grams</option>
                    <option value="litres">Litres</option>
                    <option value="metres">Metres</option>
                    <option value="rolls">Rolls</option>
                    <option value="boxes">Boxes</option>
                    <option value="cartons">Cartons</option>
                  </select>
                </div>

                <div>
                  <SmartTooltip content="Indicates if physical samples are available for investigation. Critical for root cause analysis and supplier notification.">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Available
                      <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                    </label>
                  </SmartTooltip>
                  <div className="flex items-center gap-4 mt-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="sampleAvailable"
                        checked={formData.sampleAvailable === true}
                        onChange={() => handleInputChange('sampleAvailable', true)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="sampleAvailable"
                        checked={formData.sampleAvailable === false}
                        onChange={() => handleInputChange('sampleAvailable', false)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Barcode className="w-4 h-4" />
                  Traceability Information
                  <SmartTooltip content="Complete traceability is essential for BRCGS compliance. All fields help track the product journey and identify affected batches.">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </SmartTooltip>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <SmartTooltip content="Supplier's batch or lot number. Found on delivery notes or product packaging. Essential for supplier traceability.">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier Batch/Lot Number
                        <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                      </label>
                    </SmartTooltip>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.supplierBatchNo}
                        onChange={(e) => handleInputChange('supplierBatchNo', e.target.value)}
                        placeholder="Enter supplier batch number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <SmartTooltip content="Scan barcode from product packaging">
                        <button
                          type="button"
                          className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <Barcode className="w-4 h-4" />
                          Scan
                        </button>
                      </SmartTooltip>
                    </div>
                  </div>

                  <div>
                    <SmartTooltip content="Supplier's reel or box identification numbers. Multiple numbers separated by commas if applicable.">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier Reel/Box Numbers
                        <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                      </label>
                    </SmartTooltip>
                    <input
                      type="text"
                      value={formData.supplierReelBoxNumbers}
                      onChange={(e) => handleInputChange('supplierReelBoxNumbers', e.target.value)}
                      placeholder="R-1234, R-1235 or B-456, B-457"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <SmartTooltip content="Kangopak's internal work order number. Links to production scheduling and job costing systems.">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kangopak Work Order Number
                        <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                      </label>
                    </SmartTooltip>
                    <input
                      type="text"
                      value={formData.kangopakWONumber}
                      onChange={(e) => handleInputChange('kangopakWONumber', e.target.value)}
                      placeholder="WO-2025-001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <SmartTooltip content="Kangopak's carton numbers for finished products. Used for customer notification and recall procedures.">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kangopak Carton Numbers
                        <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                      </label>
                    </SmartTooltip>
                    <input
                      type="text"
                      value={formData.kangopakCartonNumbers}
                      onChange={(e) => handleInputChange('kangopakCartonNumbers', e.target.value)}
                      placeholder="C-2025-001-024, C-2025-001-025"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <SmartTooltip content="Person who first identified the non-conformance. Required for follow-up questions and verification.">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NCA Raised By <span className="text-red-500">*</span>
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </label>
                </SmartTooltip>
                <div className="flex gap-2">
                  <select
                    value={formData.ncaRaisedBy}
                    onChange={(e) => handleInputChange('ncaRaisedBy', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Person</option>
                    <option value="Quality Inspector">Quality Inspector</option>
                    <option value="Line Operator">Line Operator</option>
                    <option value="Supervisor">Production Supervisor</option>
                    <option value="Maintenance">Maintenance Technician</option>
                    <option value="Incoming Inspection">Incoming Inspection</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Management">Management</option>
                  </select>
                  <SmartTooltip content="Add location data to identify where issue was detected">
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Location
                    </button>
                  </SmartTooltip>
                </div>
              </div>

              {/* AI-Powered Priority Assessment */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-800">AI Priority Assessment</h4>
                  <div className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">
                    SMART
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">HIGH</div>
                    <div className="text-xs text-gray-600">Safety Impact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">8.5/10</div>
                    <div className="text-xs text-gray-600">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">14</div>
                    <div className="text-xs text-gray-600">Days to Close</div>
                  </div>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  🤖 AI Analysis: Foreign material contamination detected. Immediate containment required. Similar cases resolved in 8-14 days.
                </p>
              </div>
            </div>
          )}

          {/* Steps 3-5 Placeholder */}
          {currentStep > 2 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <Bot className="w-5 h-5" />
                <span className="font-medium">Step {currentStep} - Implementation in Progress</span>
              </div>
              <p className="text-gray-500 mt-4">
                This step will include the same god-tier AI assistance, tooltips, and intelligent validation.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </div>
              
              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  Next
                  <span className="text-xs">({validateStep(currentStep + 1).length === 0 ? '✓' : '!'})</span>
                </button>
              ) : (
                <button
                  onClick={() => {/* Submit form */}}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Create NCA
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}