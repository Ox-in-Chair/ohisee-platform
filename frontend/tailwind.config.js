/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // OhiSee! brand colors
        primary: {
          DEFAULT: '#373658',
          50: '#f5f5f7',
          100: '#ebebef',
          200: '#cdcdd8',
          300: '#afafc1',
          400: '#737393',
          500: '#373658',
          600: '#31314f',
          700: '#2a2a42',
          800: '#222235',
          900: '#1b1b2b',
        },
        secondary: {
          DEFAULT: '#C44940',
          50: '#fdf4f3',
          100: '#fbe8e6',
          200: '#f6c5c1',
          300: '#f0a29c',
          400: '#e55c51',
          500: '#C44940',
          600: '#b0423a',
          700: '#933730',
          800: '#772c26',
          900: '#61241f',
        },
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography system from Typography.md
        'h1-desktop': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'h1-mobile': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2-desktop': ['32px', { lineHeight: '1.3', fontWeight: '500' }],
        'h2-mobile': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'h3-desktop': ['24px', { lineHeight: '1.4', fontWeight: '500' }],
        'h3-mobile': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-large': ['18px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.5' }],
        'body-small': ['14px', { lineHeight: '1.5' }],
      },
      spacing: {
        // 8px base unit system
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'card': '0px 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0px 4px 16px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        // Responsive breakpoints from Typography.md
        'xs': '480px',
        'sm': '600px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}