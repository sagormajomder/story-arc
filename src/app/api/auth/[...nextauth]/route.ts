import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
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
            },
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
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url || baseUrl;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/google`,
              {
                method: 'POST',
                body: JSON.stringify({
                  name: user.name,
                  email: user.email,
                  profileImage: user.image,
                }),
                headers: { 'Content-Type': 'application/json' },
              },
            );

            if (res.ok) {
              const backendUser = await res.json();
              token.id = backendUser._id;
              token.role = backendUser.role || 'user';
              token.accessToken = backendUser.token;
              token.picture = backendUser.profileImage;
            } else {
              console.error(
                'NextAuth: Google Login Backend Failed',
                res.status,
              );
            }
          } catch (error) {
            console.error('NextAuth: Google Login Error', error);
          }
        } else {
          token.id = user._id;
          token.role = user.role || 'user';
          token.accessToken = user.token;
          token.picture = user.profileImage;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.token = token.accessToken;
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role || 'user',
          profileImage: token.picture,
        };
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
