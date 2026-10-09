import { contentIllustration } from '../content-illustration'
import type { IllustrationOptions } from '../illustration-catalog'
import type { PublicContent } from '../types'
import { IllustrationScene } from './IllustrationScene'

export function GeneratedArticleCover({
  item,
  instance = 'cover',
  options = {},
}: {
  item: PublicContent
  instance?: string
  options?: IllustrationOptions
}) {
  return <IllustrationScene scene={contentIllustration(item, options)} instance={instance} />
}
