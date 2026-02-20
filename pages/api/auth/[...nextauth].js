import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!BASE_URL) {
          console.error("❌ NEXT_PUBLIC_BACKEND_URL is not defined");
          return false;
        }

        const response = await fetch(
          `${BASE_URL}/api/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              googleId: profile?.sub,
            }),
          }
        );

        // If backend sleeping or failing
        if (!response.ok) {
          console.error("❌ Backend returned error:", response.status);
          return false;
        }

        const data = await response.json();

        if (!data || !data.token) {
          console.error("❌ Invalid backend response:", data);
          return false;
        }

        // Attach backend info to user
        user.isNewUser = !data.existing;
        user.backendToken = data.token;

        return true;
      } catch (error) {
        console.error("❌ Google login failed:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.isNewUser = user.isNewUser;
        token.backendToken = user.backendToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.email = token.email;
      session.user.isNewUser = token.isNewUser;
      session.backendToken = token.backendToken;
      return session;
    },

    async redirect({ baseUrl, token }) {
      if (token?.isNewUser) {
        return `${baseUrl}/complete-account?email=${token.email}`;
      }
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/",
  },
});