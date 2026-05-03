import type { GlobalConfig } from 'payload'
import type { ResolvedOptions, ZernioPlatform } from '../types'

const PLATFORM_LABELS: Record<ZernioPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
}

export const SocialSettings = (options: ResolvedOptions): GlobalConfig => ({
  slug: 'social-settings',
  label: 'Social Settings',
  admin: {
    description: 'Zernio account IDs. Set these after completing OAuth on zernio.com.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'zernio',
      type: 'group',
      label: 'Zernio',
      fields: [
        {
          name: 'profileId',
          type: 'text',
          label: 'Profile ID',
          admin: {
            description: 'From Zernio dashboard. Required for all API calls.',
          },
        },
        ...options.platforms.map(p => ({
          name: `${p}AccountId` as string,
          type: 'text' as const,
          label: `${PLATFORM_LABELS[p]} Account ID`,
          admin: {
            description: `From GET /v1/accounts after ${PLATFORM_LABELS[p]} OAuth.`,
          },
        })),
      ],
    },
  ],
})
