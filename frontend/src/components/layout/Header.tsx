'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'

interface HeaderProps {
  activeModule?: string
  setActiveModule?: (module: string) => void
  modules?: Array<{
    id: string
    title: string
    icon: React.ReactNode
    href: string
  }>
  showNavigation?: boolean
}

export function Header({ 
  activeModule = 'dashboard', 
  setActiveModule, 
  modules = [], 
  showNavigation = true 
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-lg shimmer-effect">
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 border border-white/20">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">OhiSee!</h1>
              <p className="text-sm text-white/90">Operations Intelligence Centre</p>
            </div>
          </div>
          <div className="flex items-center gap-4 animate-slide-in-right">
            <Link href="/admin" className="text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-lg transition-all hover:bg-white/10 text-sm">
              Admin Center
            </Link>
            <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer border border-white/20">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
      
      {showNavigation && (
        <nav className="bg-gradient-to-r from-blue-950 via-slate-950 to-blue-950 px-6 shadow-inner">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveModule?.('dashboard')}
              className={`py-3 px-4 border-b-3 transition-all flex items-center gap-2 hover:scale-105 relative group ${
                activeModule === 'dashboard' 
                  ? 'border-secondary text-white transform scale-105' 
                  : 'border-transparent text-white/70 hover:text-white hover:bg-white/10 rounded-t-lg'
              }`}
            >
              <Home className={`w-4 h-4 transition-transform ${activeModule === 'dashboard' ? 'rotate-12' : 'group-hover:scale-110'}`} />
              <span className="text-white">Dashboard</span>
              {activeModule === 'dashboard' && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              )}
            </button>
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule?.(module.id)}
                className={`py-3 px-4 border-b-3 transition-all flex items-center gap-2 whitespace-nowrap hover:scale-105 relative group ${
                  activeModule === module.id 
                    ? 'border-secondary text-white transform scale-105' 
                    : 'border-transparent text-white/70 hover:text-white hover:bg-white/10 rounded-t-lg'
                }`}
              >
                <div className={`transition-transform ${activeModule === module.id ? 'rotate-12' : 'group-hover:scale-110'}`}>
                  {module.icon}
                </div>
                <span className="text-white">{module.title}</span>
                {activeModule === module.id && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}