import type { AuthAction, AuthConfig, Session } from '@auth/core/types'
import { Auth, isAuthAction } from '@auth/core'
import type { H3Event } from 'h3'
import { toWebRequest, eventHandler } from 'h3'

export interface NuxtAuthConfig extends AuthConfig {
  /**
   * Defines the base path for the auth routes.
   * @default '/api/auth'
   */
  prefix?: string
}

export function NuxtAuthHandler(authOptions: AuthConfig) {
  authOptions.basePath ??= '/api/auth'
  authOptions.secret ??= process.env.AUTH_SECRET
  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST
    ?? process.env.VERCEL
    ?? process.env.NODE_ENV !== 'production'
  )

  return eventHandler(async (event) => {
    const request = toWebRequest(event)

    const url = new URL(request.url)
    const action = url.pathname
      .slice(authOptions.basePath!.length + 1)
      .split('/')[0] as AuthAction

    if (isAuthAction(action) && !url.pathname.startsWith(authOptions.basePath + '/')) {
      return
    }

    return await Auth(request, authOptions)
  })
}

export type GetSessionResult = Promise<Session | null>

export async function getSession(
  event: H3Event,
  options: Omit<AuthConfig, 'raw'>,
): GetSessionResult {
  const req = toWebRequest(event)
  options.basePath ??= '/api/auth'
  options.secret ??= process.env.AUTH_SECRET
  options.trustHost ??= true

  const url = new URL('/api/auth/session', req.url)
  const response = await Auth(
    new Request(url, { headers: req.headers }),
    options,
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}
