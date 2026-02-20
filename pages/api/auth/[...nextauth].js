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
    if (!profile?.email || !profile?.sub) {
      console.error("Missing Google profile data");
      return false;
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!BASE_URL) {
      console.error("NEXT_PUBLIC_BACKEND_URL missing");
      return false;
    }

    const res = await fetch(`${BASE_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        googleId: profile.sub,
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("Backend error:", text);
      return false;
    }

    const data = JSON.parse(text);

    if (!data.token) {
      console.error("No token from backend:", data);
      return false;
    }

    user.isNewUser = !data.existing;
    user.backendToken = data.token;

    return true;
  } catch (err) {
    console.error("SignIn crash:", err);
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