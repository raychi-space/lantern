import Image from 'next/image'
import mantaLight from '@/shared/assets/brand/manta-light.webp'
import mantaDark from '@/shared/assets/brand/manta-dark.webp'

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-icon ${className}`} aria-hidden="true">
      <Image
        src={mantaLight}
        className="brand-icon-light"
        alt=""
        width={60}
        height={40}
        loading="eager"
        unoptimized
      />
      <Image
        src={mantaDark}
        className="brand-icon-dark"
        alt=""
        width={60}
        height={40}
        loading="eager"
        unoptimized
      />
    </span>
  )
}
