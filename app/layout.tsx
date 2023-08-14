import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "@/components/Provider";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body className="scroll-smooth">
        <Provider>
          {children}
          <Toaster />
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
