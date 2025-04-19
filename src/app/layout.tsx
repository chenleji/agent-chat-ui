import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AuthProvider } from "@/providers/auth-provider";
import { AuthCheckWrapper } from "@/components/auth/AuthCheckWrapper";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  title: "InsureX Agent",
  description: "InsureX Agent by HUIZ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn">
      <body className={inter.className}>
        <NuqsAdapter>
          <AuthProvider>
            <AuthCheckWrapper>{children}</AuthCheckWrapper>
          </AuthProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
