import Image from 'next/image'
import quietWindow from '@/shared/assets/quiet-window.webp'

export function PaperScene({ className = '' }: { className?: string }) {
  return (
    <Image
      src={quietWindow}
      alt=""
      aria-hidden="true"
      className={`paper-scene ${className}`}
      sizes="(max-width: 650px) 100vw, (max-width: 900px) 80vw, 45vw"
    />
  )
}
