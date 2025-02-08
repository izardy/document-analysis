import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import ldap, {
  SearchEntryObject,
  Client,
  SearchOptions,
  Error as LDAPError,
  SearchCallbackResponse,
  Attribute,
} from "ldapjs";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    {
      id: "ldap",
      name: "LDAP",
      type: "credentials",
      credentials: {
        username: { label: "DN", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown>): Promise<any> {
        const username = credentials.username as string;
        const password = credentials.password as string;

        if (!username || !password) {
          return null;
        }
        // Establish LDAP connection
        const client: Client = ldap.createClient({
          url: process.env.LDAP_URI || "ldaps://ldap.example.com:636",
          tlsOptions: { rejectUnauthorized: false },
        });

        try {
          // Bind using credentials
          const bindDN = `cn=${username},${process.env.LDAP_BASE_DN}`;
          await new Promise((resolve, reject) => {
            client.bind(bindDN, password, (error: LDAPError | null) => {
              if (error) {
                reject(error);
              } else {
                resolve(true);
              }
            });
          });

          // Search for user details
          const searchOptions: SearchOptions = {
            scope: "sub",
            filter: `(cn=${username})`,
            attributes: ["cn", "mail"],
          };

          const user = await new Promise((resolve, reject) => {
            client.search(
              process.env.LDAP_BASE_DN || "",
              searchOptions,
              (error: LDAPError | null, res: SearchCallbackResponse) => {
                if (error) {
                  reject(error);
                }

                res.on("searchEntry", (entry: SearchEntryObject) => {
                  const attributes = entry.attributes as Attribute[];
                  resolve({
                    id: entry.objectName,
                    name: attributes.find((a) => a.type === "cn")?.values[0],
                    email: attributes.find((a) => a.type === "mail")?.values[0],
                  });
                });
              },
            );
          });

          return user as any;
        } catch (error) {
          console.error("LDAP Auth Error:", error);
          return null;
        } finally {
          client.unbind();
        }
      },
    },
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
