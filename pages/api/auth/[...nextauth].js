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
  const res = await fetch("http://localhost:5000/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      googleId: user.id,
    }),
  });

  const data = await res.json();

  // 🔑 SAVE BACKEND JWT
  if (data.token) {
    // ❗ runs only on client
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
    }
  }

  user.isNewUser = !data.existing;
  return true;
},


    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.isNewUser = user.isNewUser;
      }
      return token;
    },

    async session({ session, token }) {
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
