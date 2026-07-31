import { createAuthCallbackHandler } from '@hermescnp/auth/handlers'

export const GET = createAuthCallbackHandler({ defaultNext: '/' })
