export default defineNuxtConfig({
  // https://v3.nuxtjs.org/migration/runtime-config#runtime-config
  runtimeConfig: {
    secret: process.env.AUTH_SECRET,
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
})
