"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialPosts = void 0;
const scheduleZernio_1 = require("../hooks/scheduleZernio");
const PLATFORM_LABELS = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter/X',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
};
const SocialPosts = (options) => ({
    slug: 'social-posts',
    admin: {
        useAsTitle: 'caption',
        defaultColumns: ['caption', 'postStatus', 'platforms', 'scheduledAt'],
        description: 'Social media posts. Set a schedule date to queue for Zernio delivery.',
    },
    access: {
        read: ({ req }) => Boolean(req.user),
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
        delete: ({ req }) => Boolean(req.user),
    },
    fields: [
        {
            name: 'caption',
            type: 'textarea',
            required: true,
            admin: { rows: 5 },
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: 'Optional. Must be a public URL in production. Local dev images are skipped.',
            },
        },
        {
            name: 'platforms',
            type: 'select',
            hasMany: true,
            required: true,
            defaultValue: options.platforms,
            options: options.platforms.map(p => ({ label: PLATFORM_LABELS[p], value: p })),
            admin: {
                position: 'sidebar',
                description: 'Which platforms to post to.',
            },
        },
        {
            name: 'scheduledAt',
            label: 'Scheduled Date & Time',
            type: 'date',
            admin: {
                description: 'Set this to queue the post. Saving triggers the Zernio hook.',
                date: { pickerAppearance: 'dayAndTime' },
                position: 'sidebar',
            },
        },
        // NOTE: Do NOT name this field 'status' — reserved by Payload drafts+Postgres.
        {
            name: 'postStatus',
            label: 'Post Status',
            type: 'select',
            defaultValue: 'draft',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Published', value: 'published' },
                { label: 'Failed', value: 'failed' },
            ],
            admin: {
                description: 'Controlled by the Zernio hook and webhook. Reset to Draft to reschedule.',
                position: 'sidebar',
            },
        },
        {
            name: 'zernioPostId',
            label: 'Zernio Post ID',
            type: 'text',
            admin: {
                position: 'sidebar',
                readOnly: true,
                description: 'Set by Zernio on schedule. Do not edit.',
            },
        },
        {
            name: 'errorMessage',
            label: 'Error Message',
            type: 'text',
            admin: {
                position: 'sidebar',
                readOnly: true,
                description: 'Set by Zernio webhook on failure.',
            },
        },
    ],
    hooks: {
        afterChange: [(0, scheduleZernio_1.makeScheduleZernio)(options)],
    },
});
exports.SocialPosts = SocialPosts;
//# sourceMappingURL=SocialPosts.js.map