'use client'

import React, { useState, useRef, useCallback, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface Widget {
  id: string
  title: string
  content: ReactNode
  minWidth?: number
  minHeight?: number
  resizable?: boolean
}

interface DragDropWidgetProps {
  widgets: Widget[]
  onWidgetOrderChange?: (newOrder: Widget[]) => void
  onWidgetRemove?: (widgetId: string) => void
  className?: string
  columns?: number
  gap?: number
}

export function DragDropWidget({
  widgets,
  onWidgetOrderChange,
  onWidgetRemove,
  className = '',
  columns = 3,
  gap = 16
}: DragDropWidgetProps) {
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [widgetOrder, setWidgetOrder] = useState(widgets)
  const containerRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  const handleDragStart = useCallback((e: React.DragEvent, widget: Widget) => {
    if (!motionConfig.shouldAnimate) return
    
    setDraggedWidget(widget)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', widget.id)
    
    // Add drag styles
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '0.5'
  }, [motionConfig.shouldAnimate])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '1'
    
    setDraggedWidget(null)
    setDragOverIndex(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (!draggedWidget) return

    const dragIndex = widgetOrder.findIndex(w => w.id === draggedWidget.id)
    if (dragIndex === dropIndex) return

    // Create new order
    const newOrder = [...widgetOrder]
    const [removed] = newOrder.splice(dragIndex, 1)
    newOrder.splice(dropIndex, 0, removed)

    setWidgetOrder(newOrder)
    onWidgetOrderChange?.(newOrder)
    setDragOverIndex(null)
  }, [draggedWidget, widgetOrder, onWidgetOrderChange])

  const handleRemoveWidget = useCallback((widgetId: string) => {
    const newOrder = widgetOrder.filter(w => w.id !== widgetId)
    setWidgetOrder(newOrder)
    onWidgetRemove?.(widgetId)
  }, [widgetOrder, onWidgetRemove])

  return (
    <div
      ref={containerRef}
      className={`grid gap-${gap / 4} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`
      }}
    >
      {widgetOrder.map((widget, index) => (
        <WidgetCard
          key={widget.id}
          widget={widget}
          index={index}
          isDragged={draggedWidget?.id === widget.id}
          isDragOver={dragOverIndex === index}
          onDragStart={(e) => handleDragStart(e, widget)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onRemove={() => handleRemoveWidget(widget.id)}
          motionConfig={motionConfig}
        />
      ))}
    </div>
  )
}

interface WidgetCardProps {
  widget: Widget
  index: number
  isDragged: boolean
  isDragOver: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onRemove: () => void
  motionConfig: any
}

function WidgetCard({
  widget,
  isDragged,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onRemove,
  motionConfig
}: WidgetCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      draggable={motionConfig.shouldAnimate}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        bg-white rounded-xl border-2 transition-all cursor-move
        ${isDragOver ? 'border-primary border-dashed' : 'border-gray-200'}
        ${isDragged ? 'scale-105 shadow-lg' : 'hover:shadow-md'}
      `}
      style={{
        minWidth: widget.minWidth || 'auto',
        minHeight: widget.minHeight || '200px',
        transitionDuration: `${motionConfig.duration.standard}ms`,
        transitionTimingFunction: motionConfig.easing.out
      }}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <div className="drag-handle cursor-grab active:cursor-grabbing">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6-12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </div>
          
          <h3 className="font-semibold text-gray-800 text-sm">{widget.title}</h3>
        </div>

        {/* Widget Controls */}
        <div className={`flex items-center gap-1 transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
            title="Remove widget"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4">
        {widget.content}
      </div>
    </div>
  )
}

// Drag and drop grid layout with snap zones
interface DragDropGridProps {
  children: ReactNode[]
  columns: number
  onLayoutChange?: (layout: Array<{ id: string; x: number; y: number }>) => void
  className?: string
}

export function DragDropGrid({
  children,
  columns,
  onLayoutChange,
  className = ''
}: DragDropGridProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [dropZones, setDropZones] = useState<Array<{ x: number; y: number }>>([])
  const gridRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  const calculateDropZones = useCallback(() => {
    if (!gridRef.current) return

    const rect = gridRef.current.getBoundingClientRect()
    const cellWidth = rect.width / columns
    const cellHeight = 200 // Approximate cell height
    
    const zones = []
    for (let row = 0; row < Math.ceil(children.length / columns) + 1; row++) {
      for (let col = 0; col < columns; col++) {
        zones.push({
          x: col * cellWidth,
          y: row * cellHeight
        })
      }
    }
    
    setDropZones(zones)
  }, [children.length, columns])

  React.useEffect(() => {
    calculateDropZones()
    window.addEventListener('resize', calculateDropZones)
    return () => window.removeEventListener('resize', calculateDropZones)
  }, [calculateDropZones])

  return (
    <div
      ref={gridRef}
      className={`relative grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}
    >
      {children.map((child, index) => (
        <div
          key={index}
          draggable={motionConfig.shouldAnimate}
          onDragStart={() => setDraggedItem(index)}
          onDragEnd={() => setDraggedItem(null)}
          className={`
            transition-all cursor-move
            ${draggedItem === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
          `}
          style={{
            transitionDuration: `${motionConfig.duration.standard}ms`,
            transitionTimingFunction: motionConfig.easing.out
          }}
        >
          {child}
        </div>
      ))}

      {/* Drop Zone Indicators */}
      {draggedItem !== null && dropZones.map((zone, index) => (
        <div
          key={`drop-${index}`}
          className="absolute border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg pointer-events-none"
          style={{
            left: zone.x,
            top: zone.y,
            width: `calc(${100 / columns}% - 1rem)`,
            height: '180px',
            zIndex: 10
          }}
        />
      ))}
    </div>
  )
}

// Widget library for adding new widgets
interface WidgetLibraryProps {
  availableWidgets: Array<{
    id: string
    title: string
    description: string
    icon: ReactNode
    preview: ReactNode
  }>
  onAddWidget: (widgetId: string) => void
  className?: string
}

export function WidgetLibrary({
  availableWidgets,
  onAddWidget,
  className = ''
}: WidgetLibraryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const motionConfig = useMotionConfig()

  return (
    <div className={`relative ${className}`}>
      {/* Add Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Widget
      </button>

      {/* Widget Library Modal */}
      {isOpen && (
        <div
          className={`
            absolute top-12 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-80 z-50
            transition-all
            ${motionConfig.shouldAnimate ? 'animate-fade-in' : ''}
          `}
          style={{
            transitionDuration: `${motionConfig.duration.standard}ms`,
            transitionTimingFunction: motionConfig.easing.out
          }}
        >
          <h3 className="font-semibold text-gray-800 mb-4">Available Widgets</h3>
          
          <div className="space-y-3">
            {availableWidgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  onAddWidget(widget.id)
                  setIsOpen(false)
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-primary">{widget.icon}</div>
                  <div>
                    <h4 className="font-medium text-sm">{widget.title}</h4>
                    <p className="text-xs text-gray-600">{widget.description}</p>
                  </div>
                </div>
                
                <button className="text-primary text-xs font-medium">
                  Add
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}