import { defineNuxtPlugin, useUserSession } from '#imports'

export default defineNuxtPlugin({
  name: 'session-fetch-plugin',
  async setup() {
    await useUserSession().fetch()
  },
})
