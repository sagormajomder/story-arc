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
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url || baseUrl;
    },
    async jwt({ token, user, account }) {
      console.log('JWT Callback Start. Token Keys:', Object.keys(token));

      // Initial sign on
      // 'user' is defined ONLY on the initial sign-in
      if (user) {
        console.log('NextAuth: Initial Sign-in. Provider:', account?.provider);

        if (account?.provider === 'google') {
          try {
            // Sync with backend for Google
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
              }
            );

            if (res.ok) {
              const backendUser = await res.json();
              console.log(
                'NextAuth: Google Login Success. Role:',
                backendUser.role
              );

              token.id = backendUser._id;
              token.role = backendUser.role || 'user';
              token.accessToken = backendUser.token;
              token.picture = backendUser.profileImage;
            } else {
              console.error(
                'NextAuth: Google Login Backend Failed',
                res.status
              );
            }
          } catch (error) {
            console.error('NextAuth: Google Login Error', error);
          }
        } else {
          // Credentials Login (or default)
          console.log(
            'NextAuth: Credentials Login Processing. Role:',
            user.role
          );

          token.id = user._id;
          token.role = user.role || 'user';
          token.accessToken = user.token;
          token.picture = user.profileImage;
        }
      }

      console.log('JWT Callback End. Token Keys:', Object.keys(token)); // Verify keys exist here
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
