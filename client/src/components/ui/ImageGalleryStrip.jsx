import { useRef, useEffect } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const GALLERY_IMAGES = [
  { src: '/2026-01-17 16-59-00.webp', alt: 'Community support volunteers' },
  { src: '/2026-01-17 17-02-56.webp', alt: 'Hope Haven reading area' },
  { src: '/2026-01-17 17-03-14.webp', alt: 'Community gathering' },
  { src: '/2026-01-17 17-05-34.webp', alt: 'Local outreach services' },
  { src: '/2026-01-17 17-07-00.webp', alt: 'Warming center' },
]

function ImageGalleryStrip() {
  const scrollRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const container = scrollRef.current
    if (!container || prefersReducedMotion) return

    let animationId
    let scrollPos = 0
    const speed = 0.5

    const animate = () => {
      scrollPos += speed
      if (scrollPos >= container.scrollWidth / 2) {
        scrollPos = 0
      }
      container.scrollLeft = scrollPos
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [prefersReducedMotion])

  const images = prefersReducedMotion
    ? GALLERY_IMAGES
    : [...GALLERY_IMAGES, ...GALLERY_IMAGES]

  return (
    <div className="w-full overflow-hidden py-8">
      <p className="text-center text-sm text-muted-foreground mb-4">
        Serving Acadiana communities
      </p>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        style={{ scrollBehavior: prefersReducedMotion ? 'auto' : 'unset' }}
      >
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden"
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGalleryStrip
