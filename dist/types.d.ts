export type ZernioPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
export interface ZernioPluginOptions {
    apiKey: string;
    platforms?: ZernioPlatform[];
    timezone?: string;
}
export interface ResolvedOptions {
    apiKey: string;
    platforms: ZernioPlatform[];
    timezone: string;
}
//# sourceMappingURL=types.d.ts.map