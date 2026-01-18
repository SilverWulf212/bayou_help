import { useState } from 'react'

const ASPECT_RATIOS = {
  wide: 'aspect-[21/9]',
  hero: 'aspect-[16/9]',
  standard: 'aspect-[4/3]',
  square: 'aspect-square',
}

function HeroImage({
  src,
  alt,
  overlayOpacity = 0.4,
  overlayColor = '0, 0, 0',
  aspectRatio = 'hero',
  height,
  children,
  className = '',
}) {
  const [loaded, setLoaded] = useState(false)

  const aspectClass = height ? '' : ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS.hero

  return (
    <div
      className={`relative overflow-hidden ${aspectClass} ${className}`}
      style={height ? { height } : undefined}
    >
      <div
        className={`absolute inset-0 bg-muted transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(8px)' }}
      />

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(${overlayColor}, ${overlayOpacity * 0.3}) 0%, rgba(${overlayColor}, ${overlayOpacity}) 100%)`,
        }}
      />

      {children && (
        <div className="relative z-10 h-full flex flex-col">{children}</div>
      )}
    </div>
  )
}

export default HeroImage
