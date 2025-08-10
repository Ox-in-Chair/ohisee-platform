import { format } from 'date-fns'

interface DocumentHeaderProps {
  docRef?: string
  revision?: string
  date?: Date
  className?: string
}

export function DocumentHeader({
  docRef = '1.1.3',
  revision = '1',
  date = new Date('2025-08-07'),
  className = '',
}: DocumentHeaderProps) {
  const complianceStandard = process.env.NEXT_PUBLIC_COMPLIANCE_STANDARD || 'GMP';
  
  return (
    <div className={`document-header ${className}`}>
      <div className="flex justify-between items-center text-sm md:text-base">
        <div className="flex gap-4 md:gap-8">
          <span className="font-medium">
            Doc Ref: <span className="font-normal">{docRef}</span>
          </span>
          <span className="font-medium">
            Rev: <span className="font-normal">{revision}</span>
          </span>
        </div>
        <span className="font-medium">
          Date: <span className="font-normal">{format(date, 'dd MMMM yyyy')}</span>
        </span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mt-3">
        OhiSee! - Operations Intelligence Centre
      </h1>
      <p className="text-sm md:text-base mt-1 opacity-90">
        Multi-Tenant Compliance Management Platform
      </p>
    </div>
  )
}