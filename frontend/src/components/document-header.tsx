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
      <h1 className="text-xl md:text-2xl font-semibold mt-2">
        BRCGS Confidential Reporting (Whistleblower) Policy
      </h1>
    </div>
  )
}