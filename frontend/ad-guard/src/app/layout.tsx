import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { auth } from "@/server/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ClientProviders } from "@/components/providers/client-providers";

export const metadata: Metadata = {
  title: "Ad Guards | CARLS x CDX",
  description:
    "An intelligent marketing compliance checker that helps ensure your advertising materials meet regulatory standards and guidelines. Part of CARLS x CDX initiative.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ClientProviders session={session}>
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
