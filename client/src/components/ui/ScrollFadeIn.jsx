import { useRef, useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const DIRECTION_TRANSFORMS = {
  up: 'translateY(24px)',
  down: 'translateY(-24px)',
  left: 'translateX(24px)',
  right: 'translateX(-24px)',
}

function ScrollFadeIn({
  children,
  direction = 'up',
  delay = 0,
  threshold = 0.1,
  once = true,
  className = '',
}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, once, prefersReducedMotion])

  const baseStyle = prefersReducedMotion
    ? {}
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : DIRECTION_TRANSFORMS[direction],
        transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
      }

  return (
    <div ref={ref} className={className} style={baseStyle}>
      {children}
    </div>
  )
}

export default ScrollFadeIn
