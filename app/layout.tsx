import "./globals.css";

import { Provider } from "@/components/Provider";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Studium AI",
  description: "Helping students with AI",
};

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
      </body>
    </html>
  );
}
