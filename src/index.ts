import type { Config } from 'payload'
import type { ZernioPluginOptions, ResolvedOptions } from './types'
import { SocialPosts } from './collections/SocialPosts'
import { SocialSettings } from './globals/SocialSettings'
import { zernioWebhook } from './endpoints/zernio-webhook'

export const zernioPlugin = (options: ZernioPluginOptions) => {
  const resolved: ResolvedOptions = {
    apiKey: options.apiKey,
    platforms: options.platforms ?? ['facebook', 'instagram'],
    timezone: options.timezone ?? 'America/Chicago',
  }

  return (incomingConfig: Config): Config => ({
    ...incomingConfig,
    collections: [...(incomingConfig.collections ?? []), SocialPosts(resolved)],
    globals: [...(incomingConfig.globals ?? []), SocialSettings(resolved)],
    endpoints: [...(incomingConfig.endpoints ?? []), zernioWebhook],
  })
}

export type { ZernioPluginOptions } from './types'
