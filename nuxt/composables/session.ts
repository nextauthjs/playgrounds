import type { Session } from '@auth/core/types'

const useSessionState = () => useState<Session | null>('nuxt-session', () => null)

export function useUserSession() {
  const sessionState = useSessionState()

  return {
    loggedIn: computed(() => Boolean(sessionState.value)),
    user: computed(() => sessionState.value || null),
    session: sessionState,
    fetch,
  }
}

async function fetch() {
  useSessionState().value = await $fetch<Session | null>('/api/auth/session', {
    headers: useRequestHeaders(),
    retry: false,
  })
}
