import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { supabaseAdmin } from './supabase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow whitelisted emails
      const { data } = await supabaseAdmin
        .from('assistant_users')
        .select('email')
        .eq('email', user.email)
        .single()

      return !!data
    },
    async session({ session, token }) {
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
