"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeScheduleZernio = void 0;
const makeScheduleZernio = (options) => async ({ doc, req }) => {
    const shouldSchedule = doc.scheduledAt && doc.postStatus === 'draft';
    if (!shouldSchedule)
        return doc;
    try {
        const settings = await req.payload.findGlobal({ slug: 'social-settings', req });
        const zernio = (settings.zernio ?? {});
        const { profileId } = zernio;
        if (!profileId) {
            req.payload.logger.warn('SocialSettings: Zernio profileId not configured');
            return doc;
        }
        let imageUrl = null;
        if (doc.image) {
            const media = await req.payload.findByID({
                collection: 'media',
                id: typeof doc.image === 'object' ? doc.image.id : doc.image,
                req,
            });
            const serverURL = req.payload.config.serverURL ?? '';
            const rawUrl = media?.url ?? '';
            if (rawUrl.startsWith('https')) {
                imageUrl = rawUrl;
            }
            else if (serverURL && rawUrl) {
                const full = `${serverURL}${rawUrl}`;
                imageUrl = full.startsWith('https') ? full : null;
            }
        }
        const platforms = doc.platforms
            .map(p => ({ platform: p, accountId: zernio[`${p}AccountId`] }))
            .filter((p) => Boolean(p.accountId));
        if (platforms.length === 0) {
            req.payload.logger.warn(`SocialPost ${doc.id}: no account IDs configured in SocialSettings for the selected platforms`);
            return doc;
        }
        const zernioRes = await fetch('https://zernio.com/api/v1/posts', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${options.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: doc.caption,
                scheduledFor: doc.scheduledAt,
                timezone: options.timezone,
                profileId,
                platforms,
                ...(imageUrl ? { mediaItems: [{ type: 'image', url: imageUrl }] } : {}),
            }),
        });
        if (!zernioRes.ok) {
            const errText = await zernioRes.text();
            throw new Error(`Zernio returned ${zernioRes.status}: ${errText}`);
        }
        const zernioData = await zernioRes.json();
        // field name may be 'id', 'postId', or '_id' — verify at integration time
        const zernioPostId = zernioData.id ?? zernioData.postId ?? zernioData._id ?? '';
        await req.payload.update({
            collection: 'social-posts',
            id: doc.id,
            data: { postStatus: 'scheduled', zernioPostId, errorMessage: null },
            req,
        });
        return { ...doc, postStatus: 'scheduled', zernioPostId };
    }
    catch (err) {
        req.payload.logger.error(`Zernio scheduling failed for SocialPost ${doc.id}: ${err}`);
        try {
            await req.payload.update({
                collection: 'social-posts',
                id: doc.id,
                data: {
                    postStatus: 'failed',
                    errorMessage: err instanceof Error ? err.message : String(err),
                },
                req,
            });
        }
        catch (updateErr) {
            req.payload.logger.error(`Could not save failure state for SocialPost ${doc.id}: ${updateErr}`);
        }
        return doc;
    }
};
exports.makeScheduleZernio = makeScheduleZernio;
//# sourceMappingURL=scheduleZernio.js.map