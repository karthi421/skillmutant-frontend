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
    async signIn({ user, profile }) {
      try {
        // ✅ Validate Google profile
        if (!profile?.email || !profile?.sub) {
          console.error("Google profile missing data");
          return false;
        }

        const BASE_URL = process.env.BACKEND_URL;

        if (!BASE_URL) {
          console.error("BACKEND_URL not set");
          throw new Error("Backend URL missing");
        }
        // ✅ Call backend
        const res = await fetch(`${BASE_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: profile.email,
            googleId: profile.sub,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Backend returned error:", errorText);
          return false;
        }

        const data = await res.json();

        if (!data?.token) {
          console.error("Backend did not return token");
          return false;
        }

        // ✅ Attach backend data to user
        user.backendToken = data.token;
        user.isNewUser = !data.existing;

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.isNewUser = user.isNewUser;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.user.email = token.email;
      session.user.isNewUser = token.isNewUser;
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