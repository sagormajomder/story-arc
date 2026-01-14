import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
            {
              method: 'POST',
              body: JSON.stringify(credentials),
              headers: { 'Content-Type': 'application/json' },
            }
          );

          const user = await res.json();

          if (res.ok && user) {
            return user;
          }

          return null;
        } catch (error) {
          console.error('Login Error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url || baseUrl;
    },
    async jwt({ token, user, account }) {
      if (account) {
        if (account.provider === 'google') {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/google`,
            {
              method: 'POST',
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                image: user.image,
              }),
              headers: { 'Content-Type': 'application/json' },
            }
          );
          if (res.ok) {
            const backendUser = await res.json();
            token.user = backendUser;
            token.role = backendUser.role || 'user';
          }
        } else if (user) {
          token.user = user;
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
        session.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
