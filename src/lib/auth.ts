import { axiosInstance } from "@/lib/axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(user) {
        if (user) return user;
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await axiosInstance.post("/auth/oauth/login", {
            email: user.email,
            firstName: profile?.given_name || user.name?.split(" ")[0],
            lastName:
              profile?.family_name || user.name?.split(" ").slice(1).join(" "),
            profilePic: user.image,
            provider: "google",
            providerId: account.providerAccountId,
          });

          return true;
        } catch (error) {
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && account.access_token) {
        token.accessToken = account.access_token;
      }

      if (profile && (profile as any).backendData) {
        token.backendData = (profile as any).backendData;
      }

      if (user) token.user = user;
      return token;
    },

    async session({ session, token }: any) {
      if (token?.backendData) {
        const { accessToken, ...userData } = token.backendData;
        session.user = userData;
        session.backendToken = accessToken;
      } else if (token?.user?.accessToken) {
        const { accessToken, ...userData } = token.user;
        session.user = userData;
        session.backendToken = accessToken;
      } else if (token?.user) {
        session.user = token.user;
      }

      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
  debug: true,
});
