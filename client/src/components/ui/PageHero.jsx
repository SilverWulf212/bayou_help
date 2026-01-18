import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import HeroImage from './HeroImage'
import ScrollFadeIn from './ScrollFadeIn'

function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  height = '180px',
  backTo = '/',
}) {
  return (
    <HeroImage
      src={imageSrc}
      alt={imageAlt}
      height={height}
      overlayOpacity={0.55}
      overlayColor="16, 38, 28"
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 flex items-center gap-4">
          <Link
            to={backTo}
            className="text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <ScrollFadeIn direction="left" delay={0}>
            <div>
              <h1 className="text-lg font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-xs text-white/80">{subtitle}</p>
              )}
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </HeroImage>
  )
}

export default PageHero
