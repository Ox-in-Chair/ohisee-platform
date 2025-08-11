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

          {/* Step 3: Immediate Action Checklist */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-red-600" />
                  <h3 className="font-medium text-red-800">Immediate Action Checklist</h3>
                  <div className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">
                    URGENT
                  </div>
                </div>
                <p className="text-sm text-red-700">
                  Complete ALL immediate actions within 24 hours of NCA detection. BRCGS 5.7 compliance requires immediate containment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cross Contamination Check */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <SmartTooltip content="CRITICAL: Assess if non-conforming product could contaminate other products. This determines the scope of quarantine actions and potential recall requirements." aiAssist>
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-500" />
                        <h4 className="font-medium text-gray-900">Cross Contamination Risk</h4>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </div>
                    </SmartTooltip>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="crossContamination"
                          checked={formData.crossContamination === true}
                          onChange={() => handleInputChange('crossContamination', true)}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-red-600">YES</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="crossContamination"
                          checked={formData.crossContamination === false}
                          onChange={() => handleInputChange('crossContamination', false)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-green-600">NO</span>
                      </label>
                    </div>
                  </div>
                  
                  {formData.crossContamination && (
                    <div className="mt-4">
                      <SmartTooltip content="Describe immediate actions taken to prevent cross contamination. Example: 'Line stopped, downstream product quarantined, equipment sanitized, segregated affected batches.'" aiAssist>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contamination Action Taken <span className="text-red-500">*</span>
                          <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                        </label>
                      </SmartTooltip>
                      <div className="flex gap-2">
                        <textarea
                          value={formData.crossContaminationAction}
                          onChange={(e) => handleInputChange('crossContaminationAction', e.target.value)}
                          rows={3}
                          placeholder="Describe contamination prevention actions taken..."
                          className="flex-1 px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <AIAssistant
                          fieldName="correctiveAction"
                          currentValue={formData.crossContaminationAction}
                          onSuggestion={(suggestion) => handleInputChange('crossContaminationAction', suggestion)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Back-tracking Investigation */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <SmartTooltip content="Track back through production to identify all potentially affected products. Essential for determining full scope of non-conformance." aiAssist>
                      <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-500" />
                        <h4 className="font-medium text-gray-900">Back-Tracking Completed</h4>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </div>
                    </SmartTooltip>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.backTrackingCompleted}
                          onChange={(e) => handleInputChange('backTrackingCompleted', e.target.checked)}
                          className="text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Complete</span>
                      </label>
                    </div>
                  </div>
                  
                  {formData.backTrackingCompleted && (
                    <div className="mt-4">
                      <SmartTooltip content="Person responsible for conducting the back-tracking investigation. Must be competent in production processes and traceability.">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Investigation Conducted By
                          <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                        </label>
                      </SmartTooltip>
                      <select
                        value={formData.backTrackingPerson}
                        onChange={(e) => handleInputChange('backTrackingPerson', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Investigator</option>
                        <option value="Quality Manager">Quality Manager</option>
                        <option value="Production Manager">Production Manager</option>
                        <option value="Technical Manager">Technical Manager</option>
                        <option value="Senior Quality Inspector">Senior Quality Inspector</option>
                        <option value="Process Engineer">Process Engineer</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance Checklist */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  BRCGS 5.7 Compliance Checklist
                  <SmartTooltip content="These actions are MANDATORY under BRCGS 5.7. All must be completed for compliance. Failure to complete may result in audit non-conformance.">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </SmartTooltip>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <SmartTooltip content="Physical HOLD labels must be applied to all affected product. Use bright colored labels clearly marked 'HOLD - DO NOT USE - NCA-XXXX'.">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-700">Hold Label Applied</span>
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </div>
                      </SmartTooltip>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.holdLabelCompleted}
                          onChange={(e) => handleInputChange('holdLabelCompleted', e.target.checked)}
                          className="text-orange-600 focus:ring-orange-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Done</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <SmartTooltip content="NCA must be recorded on the daily log sheet or quality record system. Required for traceability and audit trail.">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">Recorded on Log Sheet</span>
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </div>
                      </SmartTooltip>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.ncaRecordedOnLogSheet}
                          onChange={(e) => handleInputChange('ncaRecordedOnLogSheet', e.target.checked)}
                          className="text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Done</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <SmartTooltip content="Physically separate non-conforming product from conforming product. Use designated quarantine area or clearly marked segregation.">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">Product Segregated</span>
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </div>
                      </SmartTooltip>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.segregationCompleted}
                          onChange={(e) => handleInputChange('segregationCompleted', e.target.checked)}
                          className="text-purple-600 focus:ring-purple-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Done</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-2 text-sm">Compliance Status</h5>
                    <div className="space-y-2">
                      {[
                        { key: 'holdLabelCompleted', label: 'Hold Labels', checked: formData.holdLabelCompleted },
                        { key: 'ncaRecordedOnLogSheet', label: 'Log Sheet', checked: formData.ncaRecordedOnLogSheet },
                        { key: 'segregationCompleted', label: 'Segregation', checked: formData.segregationCompleted }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{item.label}:</span>
                          <span className={`font-bold ${item.checked ? 'text-green-600' : 'text-red-600'}`}>
                            {item.checked ? '✓ DONE' : '✗ PENDING'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Compliance: {
                          [formData.holdLabelCompleted, formData.ncaRecordedOnLogSheet, formData.segregationCompleted]
                            .filter(Boolean).length
                        }/3 Complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Action Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">AI Action Recommendations</h4>
                  <div className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold animate-pulse">
                    SMART
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-800">Time Critical Actions</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Notify Production Manager within 1 hour</li>
                      <li>• Complete quarantine within 2 hours</li>
                      <li>• Customer notification (if shipped): 4 hours</li>
                      <li>• Supplier notification: 24 hours</li>
                    </ul>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-800">Next Steps</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Schedule root cause meeting</li>
                      <li>• Prepare investigation team</li>
                      <li>• Review similar historical NCAs</li>
                      <li>• Check customer complaint history</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-300">
                  <p className="text-xs text-yellow-800">
                    🤖 <strong>AI Alert:</strong> Based on similar metal contamination cases, consider immediate equipment inspection and enhanced metal detection protocols.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Disposition */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <h3 className="font-medium text-purple-800">Product Disposition Decision</h3>
                  <div className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-bold">
                    CRITICAL
                  </div>
                </div>
                <p className="text-sm text-purple-700">
                  Determine the fate of non-conforming product. This decision impacts quality, cost, customer satisfaction, and regulatory compliance.
                </p>
              </div>

              {/* AI-Powered Disposition Recommendation */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-800">AI Disposition Recommendation</h4>
                  <div className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold animate-pulse">
                    SMART
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/60 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">REJECT</div>
                    <div className="text-xs text-gray-600 mb-2">Recommended</div>
                    <div className="text-xs text-red-700 bg-red-100 rounded px-2 py-1">
                      Safety Risk: HIGH
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-800 mb-2">Risk Factors:</div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Foreign material contamination</li>
                      <li>• Food safety impact</li>
                      <li>• Customer injury potential</li>
                    </ul>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-800 mb-2">Cost Impact:</div>
                    <div className="text-sm font-bold text-orange-600">$2,340</div>
                    <div className="text-xs text-gray-600">Estimated loss</div>
                  </div>
                </div>
              </div>

              {/* Disposition Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  Select Disposition
                  <SmartTooltip content="Choose the action to take with non-conforming product. This decision is final and affects quality records, costs, and customer relationships.">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </SmartTooltip>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      value: 'reject',
                      label: 'Reject to Supplier',
                      icon: '🚫',
                      color: 'red',
                      description: 'Product returned to supplier. Credit/replacement required.',
                      tooltip: 'Return non-conforming product to supplier. Use for supplier-caused defects. Supplier bears cost and responsibility for corrective action.',
                      fields: ['rejectToSupplier', 'creditRequired', 'upliftmentRequired']
                    },
                    {
                      value: 'rework',
                      label: 'Rework/Reprocess',
                      icon: '🔧',
                      color: 'orange',
                      description: 'Product can be corrected through rework process.',
                      tooltip: 'Product can be fixed through additional processing. Ensure rework procedures are validated and documented.',
                      fields: ['reworkRequired']
                    },
                    {
                      value: 'concession',
                      label: 'Use Under Concession',
                      icon: '⚖️',
                      color: 'yellow',
                      description: 'Product accepted with deviation from specification.',
                      tooltip: 'Product used despite deviation. Requires technical justification and customer approval. Document why deviation is acceptable.',
                      fields: ['concessionGranted']
                    },
                    {
                      value: 'discard',
                      label: 'Discard/Destroy',
                      icon: '🗑️',
                      color: 'gray',
                      description: 'Product destroyed at Kangopak facility.',
                      tooltip: 'Product cannot be corrected and poses risk if used. Destruction must be witnessed and documented.',
                      fields: ['discardAtKangopak']
                    }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('disposition', option.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        formData.disposition === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <SmartTooltip content={option.tooltip} aiAssist>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <div className={`font-medium ${
                              formData.disposition === option.value 
                                ? `text-${option.color}-800` 
                                : 'text-gray-900'
                            }`}>
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </SmartTooltip>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Disposition Actions */}
              {formData.disposition && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Disposition Actions Required
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Reject Actions */}
                    {formData.disposition === 'reject' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <SmartTooltip content="Physically return product to supplier. Required for supplier accountability.">
                            <span className="text-sm font-medium text-gray-700">Return to Supplier</span>
                          </SmartTooltip>
                          <input
                            type="checkbox"
                            checked={formData.rejectToSupplier}
                            onChange={(e) => handleInputChange('rejectToSupplier', e.target.checked)}
                            className="text-red-600 focus:ring-red-500 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <SmartTooltip content="Request credit note from supplier for rejected product value.">
                            <span className="text-sm font-medium text-gray-700">Credit Required</span>
                          </SmartTooltip>
                          <input
                            type="checkbox"
                            checked={formData.creditRequired}
                            onChange={(e) => handleInputChange('creditRequired', e.target.checked)}
                            className="text-red-600 focus:ring-red-500 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <SmartTooltip content="Supplier collection of rejected product required (at supplier cost).">
                            <span className="text-sm font-medium text-gray-700">Upliftment Required</span>
                          </SmartTooltip>
                          <input
                            type="checkbox"
                            checked={formData.upliftmentRequired}
                            onChange={(e) => handleInputChange('upliftmentRequired', e.target.checked)}
                            className="text-red-600 focus:ring-red-500 rounded"
                          />
                        </div>
                      </div>
                    )}

                    {/* Rework Actions */}
                    {formData.disposition === 'rework' && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <SmartTooltip content="Product can be corrected through additional processing steps.">
                            <span className="text-sm font-medium text-gray-700">Rework Process Required</span>
                          </SmartTooltip>
                          <input
                            type="checkbox"
                            checked={formData.reworkRequired}
                            onChange={(e) => handleInputChange('reworkRequired', e.target.checked)}
                            className="text-orange-600 focus:ring-orange-500 rounded"
                          />
                        </div>
                        {formData.reworkRequired && (
                          <div>
                            <SmartTooltip content="Detailed rework instructions. Include: process steps, quality checks, acceptance criteria, and verification requirements." aiAssist>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rework Instructions <span className="text-red-500">*</span>
                                <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                              </label>
                            </SmartTooltip>
                            <div className="flex gap-2">
                              <textarea
                                value={formData.reworkInstructions}
                                onChange={(e) => handleInputChange('reworkInstructions', e.target.value)}
                                rows={3}
                                placeholder="Describe rework process, quality checks, and acceptance criteria..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                              <AIAssistant
                                fieldName="correctiveAction"
                                currentValue={formData.reworkInstructions}
                                onSuggestion={(suggestion) => handleInputChange('reworkInstructions', suggestion)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Concession Actions */}
                    {formData.disposition === 'concession' && (
                      <div className="flex items-center justify-between">
                        <SmartTooltip content="Technical approval to use product despite deviation. Requires documented justification and customer acceptance.">
                          <span className="text-sm font-medium text-gray-700">Concession Granted</span>
                        </SmartTooltip>
                        <input
                          type="checkbox"
                          checked={formData.concessionGranted}
                          onChange={(e) => handleInputChange('concessionGranted', e.target.checked)}
                          className="text-yellow-600 focus:ring-yellow-500 rounded"
                        />
                      </div>
                    )}

                    {/* Discard Actions */}
                    {formData.disposition === 'discard' && (
                      <div className="flex items-center justify-between">
                        <SmartTooltip content="Product destroyed at Kangopak facility. Requires witnessed destruction and disposal certificate.">
                          <span className="text-sm font-medium text-gray-700">Discard at Kangopak</span>
                        </SmartTooltip>
                        <input
                          type="checkbox"
                          checked={formData.discardAtKangopak}
                          onChange={(e) => handleInputChange('discardAtKangopak', e.target.checked)}
                          className="text-gray-600 focus:ring-gray-500 rounded"
                        />
                      </div>
                    )}
                  </div>

                  {/* Authorization Required */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <SmartTooltip content="Person with authority to approve this disposition. Must be competent and have appropriate authorization level for the decision.">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Authorized By <span className="text-red-500">*</span>
                        <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                      </label>
                    </SmartTooltip>
                    <select
                      value={formData.authorizedBy}
                      onChange={(e) => handleInputChange('authorizedBy', e.target.value)}
                      className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Authorizer</option>
                      <option value="Quality Manager">Quality Manager</option>
                      <option value="Production Manager">Production Manager</option>
                      <option value="Technical Manager">Technical Manager</option>
                      <option value="Plant Manager">Plant Manager</option>
                      <option value="Managing Director">Managing Director</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Disposition Impact Analysis */}
              {formData.disposition && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Disposition Impact Analysis</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-600">$1,200</div>
                      <div className="text-xs text-gray-600">Material Cost</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-orange-600">3-5 days</div>
                      <div className="text-xs text-gray-600">Timeline</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-600">Medium</div>
                      <div className="text-xs text-gray-600">Customer Impact</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-purple-600">Low</div>
                      <div className="text-xs text-gray-600">Risk Level</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Investigation */}
          {currentStep === 5 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <Bot className="w-5 h-5" />
                <span className="font-medium">Step 5: Investigation - Ready for Implementation</span>
              </div>
              <p className="text-gray-500 mt-4">
                Final step will include Ishikawa root cause analysis, corrective actions, and preventive measures with AI guidance.
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