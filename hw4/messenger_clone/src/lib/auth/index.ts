import NextAuth from "next-auth";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import CredentialsProvider from "./CredentialsProvider";
export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [CredentialsProvider],
  callbacks: {
    async jwt({ token, account }) {
      // Sign in with social account, e.g. GitHub, Google, etc.
      if (!account) return token;
      const {name} = token;
      const provider = account.provider;
      if (!name || !provider) return token;

      // Check if the email has been registered
      const [existedUser] = await db
        .select({
          id: usersTable.displayId,
        })
        .from(usersTable)
        .where(eq(usersTable.username, name))
        .execute();
      if (existedUser) return token;
      if (provider !== "github") return token;

      // Sign up
      await db.insert(usersTable).values({
        username: name,
        provider,
      });
      console.log("jwt callback", token);
      return token;
    },
    async session({ session, token }) {
      const name = token.name || session?.user?.username;
      if (!name) return session;

      const [user] = await db
        .select({
          id: usersTable.displayId,
          username: usersTable.username,
        })
        .from(usersTable)
        .where(eq(usersTable.username, name))
        .execute();

      return {
        ...session,
        user: {
          id: user.id,
          username: usersTable.username,
        },
      };
    },
  },
  pages: {
    signIn: "/",
  },
});