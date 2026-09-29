import type { HomepageSettings } from '@/features/contents/api'

// Public repositories that make up the Raychi personal space.
export const defaultProjects: HomepageSettings['projects'] = [
  {
    name: 'Lantern',
    description: '面向访客的个人空间，承载首页、文章、帖子与回顾。',
    status: '持续迭代',
    href: 'https://github.com/raychi-space/lantern',
  },
  {
    name: 'Inkwell',
    description: '把想法写成内容，并管理草稿、发布与站点展示。',
    status: '持续迭代',
    href: 'https://github.com/raychi-space/inkwell',
  },
  {
    name: 'Wellspring',
    description: '为写作和阅读提供内容接口与发布快照。',
    status: '持续迭代',
    href: 'https://github.com/raychi-space/wellspring',
  },
]

export const defaultHomepage: HomepageSettings = {
  focus: 'Build with AI Agents',
  projects: defaultProjects,
  recentSections: [{ id: 'featured', visible: true }, { id: 'posts', visible: true }, { id: 'writing', visible: true }],
  bottomSections: [{ id: 'projects', visible: true }, { id: 'stats', visible: true }],
}
