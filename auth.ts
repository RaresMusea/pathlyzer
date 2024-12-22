import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/persistency/Db"
import { getUserById } from "@/persistency/data/User";

import authConfig from "./auth.config";
import { UserRole } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  username: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          username: user.email?.split("@")[0]
        }
      });
    }
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      token.role = existingUser.role;
      token.username = existingUser.username;
      return token;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
        session.user.username = token.username as string;
      }

      return session;
    }
  },
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
});