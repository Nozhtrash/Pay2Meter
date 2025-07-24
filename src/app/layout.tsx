
"use client";

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { useEffect }from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Metadata can't be exported from a client component.
// We can keep it here, but it won't be used.
// For it to be used, this would need to be a server component
// and the theme logic would need to be in a separate client component.
// export const metadata: Metadata = {
//   title: "Pay2Meter",
//   description: "Exponiendo los peores juegos Pay2Win. Opiniones, valoraciones y transparencia para los jugadores.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   useEffect(() => {
    const theme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
