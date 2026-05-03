"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zernioPlugin = void 0;
const SocialPosts_1 = require("./collections/SocialPosts");
const SocialSettings_1 = require("./globals/SocialSettings");
const zernio_webhook_1 = require("./endpoints/zernio-webhook");
const zernioPlugin = (options) => {
    const resolved = {
        apiKey: options.apiKey,
        platforms: options.platforms ?? ['facebook', 'instagram'],
        timezone: options.timezone ?? 'America/Chicago',
    };
    return (incomingConfig) => ({
        ...incomingConfig,
        collections: [...(incomingConfig.collections ?? []), (0, SocialPosts_1.SocialPosts)(resolved)],
        globals: [...(incomingConfig.globals ?? []), (0, SocialSettings_1.SocialSettings)(resolved)],
        endpoints: [...(incomingConfig.endpoints ?? []), zernio_webhook_1.zernioWebhook],
    });
};
exports.zernioPlugin = zernioPlugin;
//# sourceMappingURL=index.js.map