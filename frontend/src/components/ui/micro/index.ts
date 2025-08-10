// Micro-interaction library exports
// Following luxury-enhancements.md specification for OhiSee! platform

export { ButtonPress } from './ButtonPress'
export { ToggleSnap } from './ToggleSnap'
export { ToastConfirm, useToast, ToastContainer } from './ToastConfirm'
export { InlineFieldValidate, validators } from './InlineFieldValidate'
export { ListStaggerReveal, useStaggerAnimation, GridStaggerReveal } from './ListStaggerReveal'

// Re-export motion utilities
export { 
  ScrollReveal,
  ScrollParallax, 
  ScrollProgress,
  ScrollCounter,
  useIntersectionObserver 
} from '../motion/ScrollOrchestrator'

export {
  FlipTransition,
  SharedLayout,
  FlipGrid,
  useFlipAnimation,
  useLayoutShiftCompensation
} from '../motion/FlipTransition'

export { useReducedMotion, useMotionConfig } from '../../../hooks/useReducedMotion'