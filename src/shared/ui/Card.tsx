import type { ComponentProps } from 'react'

export function Card({ className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div className={className ? `card ${className}` : 'card'} {...rest}>
      {children}
    </div>
  )
}
