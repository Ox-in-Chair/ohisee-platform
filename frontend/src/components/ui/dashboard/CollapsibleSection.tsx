'use client'

import React, { useState, useRef, useEffect, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  icon?: ReactNode
  headerActions?: ReactNode
  className?: string
  onToggle?: (isOpen: boolean) => void
  disabled?: boolean
  badge?: string | number
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  icon,
  headerActions,
  className = '',
  onToggle,
  disabled = false,
  badge
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [contentHeight, setContentHeight] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  // Calculate content height when open state changes
  useEffect(() => {
    if (!contentRef.current) return

    const element = contentRef.current
    
    if (isOpen) {
      // Temporarily show content to measure height
      element.style.position = 'absolute'
      element.style.visibility = 'hidden'
      element.style.height = 'auto'
      
      const height = element.scrollHeight
      
      // Reset styles
      element.style.position = ''
      element.style.visibility = ''
      element.style.height = '0'
      
      // Trigger animation
      requestAnimationFrame(() => {
        setContentHeight(height)
      })
    } else {
      setContentHeight(0)
    }
  }, [isOpen])

  const handleToggle = () => {
    if (disabled) return
    
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(newState)
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between p-4 text-left transition-colors
          ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50 cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Toggle Icon */}
          <div
            className={`
              transition-transform flex-shrink-0
              ${isOpen ? 'rotate-90' : 'rotate-0'}
            `}
            style={{
              transitionDuration: `${motionConfig.duration.standard}ms`,
              transitionTimingFunction: motionConfig.easing.out
            }}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Icon */}
          {icon && (
            <div className="text-primary flex-shrink-0">
              {icon}
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-800 truncate">{title}</h3>

          {/* Badge */}
          {badge && (
            <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex-shrink-0">
              {badge}
            </span>
          )}
        </div>

        {/* Header Actions */}
        {headerActions && (
          <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
            {headerActions}
          </div>
        )}
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all"
        style={{
          height: contentHeight !== null ? `${contentHeight}px` : 'auto',
          transitionDuration: `${motionConfig.duration.standard}ms`,
          transitionTimingFunction: motionConfig.easing.out
        }}
      >
        <div className="p-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}

// Accordion component with multiple collapsible sections
interface AccordionProps {
  sections: Array<{
    id: string
    title: string
    content: ReactNode
    icon?: ReactNode
    badge?: string | number
    disabled?: boolean
  }>
  allowMultiple?: boolean
  defaultOpenSections?: string[]
  className?: string
  onSectionToggle?: (sectionId: string, isOpen: boolean) => void
}

export function Accordion({
  sections,
  allowMultiple = true,
  defaultOpenSections = [],
  className = '',
  onSectionToggle
}: AccordionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(defaultOpenSections)
  )

  const handleSectionToggle = (sectionId: string, isOpen: boolean) => {
    setOpenSections(prev => {
      const newOpenSections = new Set(prev)
      
      if (isOpen) {
        if (!allowMultiple) {
          newOpenSections.clear()
        }
        newOpenSections.add(sectionId)
      } else {
        newOpenSections.delete(sectionId)
      }
      
      return newOpenSections
    })
    
    onSectionToggle?.(sectionId, isOpen)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {sections.map((section) => (
        <CollapsibleSection
          key={section.id}
          title={section.title}
          icon={section.icon}
          badge={section.badge}
          disabled={section.disabled}
          defaultOpen={openSections.has(section.id)}
          onToggle={(isOpen) => handleSectionToggle(section.id, isOpen)}
        >
          {section.content}
        </CollapsibleSection>
      ))}
    </div>
  )
}

// Nested collapsible sections
interface NestedCollapsibleProps {
  data: Array<{
    id: string
    title: string
    content?: ReactNode
    children?: Array<{
      id: string
      title: string
      content: ReactNode
      badge?: string | number
    }>
    icon?: ReactNode
    badge?: string | number
  }>
  className?: string
}

export function NestedCollapsible({ data, className = '' }: NestedCollapsibleProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {data.map((parent) => (
        <CollapsibleSection
          key={parent.id}
          title={parent.title}
          icon={parent.icon}
          badge={parent.badge}
        >
          {parent.content && (
            <div className="mb-4">{parent.content}</div>
          )}
          
          {parent.children && (
            <div className="space-y-2">
              {parent.children.map((child) => (
                <CollapsibleSection
                  key={child.id}
                  title={child.title}
                  badge={child.badge}
                  className="border-l-2 border-gray-200 ml-4"
                >
                  {child.content}
                </CollapsibleSection>
              ))}
            </div>
          )}
        </CollapsibleSection>
      ))}
    </div>
  )
}

// Collapsible data table
interface CollapsibleTableProps {
  title: string
  headers: string[]
  data: Array<{
    id: string
    cells: ReactNode[]
    expandedContent?: ReactNode
    badge?: string | number
  }>
  defaultExpanded?: string[]
  className?: string
}

export function CollapsibleTable({
  title,
  headers,
  data,
  defaultExpanded = [],
  className = ''
}: CollapsibleTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    new Set(defaultExpanded)
  )

  const toggleRow = (rowId: string) => {
    setExpandedRows(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(rowId)) {
        newExpanded.delete(rowId)
      } else {
        newExpanded.add(rowId)
      }
      return newExpanded
    })
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-8 p-2"></th>
              {headers.map((header, index) => (
                <th key={index} className="text-left p-3 font-medium text-gray-700 text-sm">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <React.Fragment key={row.id}>
                <tr 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => row.expandedContent && toggleRow(row.id)}
                >
                  <td className="p-2">
                    {row.expandedContent && (
                      <button
                        className={`
                          transition-transform p-1
                          ${expandedRows.has(row.id) ? 'rotate-90' : 'rotate-0'}
                        `}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </td>
                  {row.cells.map((cell, index) => (
                    <td key={index} className="p-3 text-sm text-gray-600">
                      {cell}
                    </td>
                  ))}
                </tr>
                
                {/* Expanded Content */}
                {row.expandedContent && expandedRows.has(row.id) && (
                  <tr>
                    <td colSpan={headers.length + 1} className="p-0">
                      <div className="bg-gray-50 p-4 border-t border-gray-200">
                        {row.expandedContent}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Expandable card grid
interface ExpandableCard {
  id: string
  title: string
  summary: ReactNode
  details: ReactNode
  image?: string
  badge?: string | number
}

interface ExpandableCardGridProps {
  cards: ExpandableCard[]
  columns?: number
  className?: string
}

export function ExpandableCardGrid({
  cards,
  columns = 3,
  className = ''
}: ExpandableCardGridProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const motionConfig = useMotionConfig()

  const toggleCard = (cardId: string) => {
    setExpandedCard(prev => prev === cardId ? null : cardId)
  }

  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className={`
            bg-white border border-gray-200 rounded-xl overflow-hidden transition-all
            ${expandedCard === card.id ? 'col-span-full' : ''}
          `}
          style={{
            transitionDuration: `${motionConfig.duration.standard}ms`,
            transitionTimingFunction: motionConfig.easing.out
          }}
        >
          {card.image && (
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-32 object-cover"
            />
          )}
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{card.title}</h3>
              {card.badge && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {card.badge}
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              {card.summary}
            </div>
            
            <button
              onClick={() => toggleCard(card.id)}
              className="text-primary text-sm font-medium hover:underline"
            >
              {expandedCard === card.id ? 'Show less' : 'Show more'}
            </button>
            
            {expandedCard === card.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {card.details}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}