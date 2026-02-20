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
  async signIn({ user }) {
  try {
    const BASE_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:5000";

    const res = await fetch(
      `${BASE_URL}/api/auth/google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          googleId: user.id,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Backend auth failed:", data);
      return false;
    }

    // ⚠️ DO NOT use localStorage here
    // This runs on the server

    user.backendToken = data.token;
    user.isNewUser = !data.existing;

    return true;
  } catch (err) {
    console.error("Google sign-in error:", err);
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
