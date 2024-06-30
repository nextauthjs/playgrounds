import GithubProvider from '@auth/core/providers/github'
import type { AuthConfig } from '@auth/core'
import { NuxtAuthHandler } from '@/lib/auth/server'

const runtimeConfig = useRuntimeConfig()

export const authOptions = {
  secret: runtimeConfig.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret,
    }),
  ],
} as AuthConfig

export default NuxtAuthHandler(authOptions)
