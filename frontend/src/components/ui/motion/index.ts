// Advanced Motion System - Phase 3 Components
// Following luxury-enhancements.md specification for OhiSee! platform

// Page Transitions
export { 
  PageTransition,
  AdvancedPageTransition,
  BreadcrumbTransition,
  StaggeredReveal,
  usePageTransition 
} from './PageTransition'

// Skeleton Loaders
export { 
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  MorphingSkeleton,
  SkeletonWidget,
  SkeletonDataTable,
  useSkeletonLoader 
} from './SkeletonLoader'

// Enhanced Cards
export { 
  EnhancedCard,
  FloatingCard,
  ParallaxCard,
  MagneticCard,
  FlipCard 
} from './EnhancedCard'

// Re-export from previous phases
export { 
  ScrollReveal,
  ScrollParallax,
  ScrollProgress,
  ScrollCounter,
  useIntersectionObserver 
} from './ScrollOrchestrator'

export {
  FlipTransition,
  SharedLayout,
  FlipGrid,
  useFlipAnimation,
  useLayoutShiftCompensation
} from './FlipTransition'