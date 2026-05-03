import type { Endpoint } from 'payload'

export const zernioWebhook: Endpoint = {
  path: '/zernio-webhook',
  method: 'post',
  handler: async (req) => {
    let body: {
      postId?: string
      status?: 'published' | 'failed'
      errorMessage?: string
      publishedAt?: string
    }

    try {
      body = await (req as unknown as Request).json() as typeof body
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { postId, status, errorMessage } = body

    if (!postId || !status) {
      return Response.json({ error: 'Missing postId or status' }, { status: 400 })
    }

    if (status !== 'published' && status !== 'failed') {
      return Response.json({ received: true })
    }

    try {
      const result = await req.payload.find({
        collection: 'social-posts',
        where: { zernioPostId: { equals: postId } },
        limit: 1,
        req,
      })

      const post = result.docs[0]
      if (!post) {
        req.payload.logger.warn(`Zernio webhook: no SocialPost found with zernioPostId ${postId}`)
        return Response.json({ received: true })
      }

      await req.payload.update({
        collection: 'social-posts',
        id: post.id,
        data: {
          postStatus: status,
          ...(status === 'failed' && errorMessage ? { errorMessage } : {}),
        },
        req,
      })

      return Response.json({ received: true })
    } catch (err) {
      req.payload.logger.error(`Zernio webhook handler error: ${err}`)
      return Response.json({ error: 'Internal error' }, { status: 500 })
    }
  },
}
