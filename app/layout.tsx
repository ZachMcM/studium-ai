import "./globals.css";

import { Provider } from "@/components/Provider";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Study AI",
  description: "Helping students with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
