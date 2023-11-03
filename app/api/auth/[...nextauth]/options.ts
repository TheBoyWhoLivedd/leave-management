import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Employee from "@/models/employee.model";
import { connectToDB } from "@/lib/mongoose";
import { AuthOptions, ISODateString, RequestInternal, User } from "next-auth";
import { JWT } from "next-auth/jwt";

export type CustomSession = {
  user?: CustomUser;
  expires: ISODateString;
};

export type CustomUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  avatar?: string | null;
  isAdmin?: boolean;
};

export const authOptions: AuthOptions = {
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: CustomUser }) {
      if (user) {
        user.role = user?.role == null ? "User" : user?.role;
        token.user = user;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: CustomSession;
      token: JWT;
      user: User;
    }) {
      session.user = token.user as CustomUser;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        Email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        Password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"Email" | "Password", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ) {
        if (!credentials) {
          throw new Error("Credentials are not provided");
        }

        const { Email, Password } = credentials;
        try {
          connectToDB();
          const user = await Employee.findOne({ Email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(Password, user.Password);

          if (!passwordsMatch) {
            return null;
          }

          return {
            id: user._id,
            name: `${user.FirstName} ${user.LastName}`,
            role: user.Roles,
            email: user.Email,
            isAdmin: user.hasAdminRights,
            avatar: user.Image,
          };
        } catch (error) {
          //console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
  },
};
