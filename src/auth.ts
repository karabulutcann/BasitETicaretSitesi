import NextAuth, { CredentialsSignin, User, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { userSchema } from "@/db/schema";
import { compare } from "bcrypt";

import { object, string, ZodError } from "zod";
import { hkdf } from "crypto";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

declare module "next-auth" {

  interface User {
    /** The user's postal address. */
    isStuff: boolean
  }
}

import { JWT } from "next-auth/jwt";
 
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string,
    isStuff: boolean
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "örnek@örnek.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        //TODO : bir hata oluştuğunda yada null döndüğünde callbacroute hatası veriyo authjs de hata var şu anki sürümda hata var 
        //https://github.com/nextauthjs/next-auth/issues/11074
        try {
          let user = undefined;
          const { email, password } =
            await signInSchema.parseAsync(credentials);

          user = await db.query.userSchema.findFirst({
            where: eq(userSchema.email, (email as string).trim()),
          });
          if (!user) {
            return null;
          }

          if (user.isGuest) {
            return null
          }

          if (!(await compare(password as string, user.password))) {
            return null;
          }
          user = {
            id: user.id,
            email: user.email,
            name: user.name,
            isStuff: user.isStuff,
          };
          
          return user;
        } catch (error) {
          return null;
        }

      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        token.id = user.id!;
        token.isStuff = user.isStuff; 
      }
      return token;
    },
    session({ session, token }) {
      // `session.user.address` is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          isStuff: token.isStuff,
        },
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
